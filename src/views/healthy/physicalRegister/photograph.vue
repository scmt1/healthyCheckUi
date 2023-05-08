<template>
    <Modal v-model="show"  title="人脸采集" class="photograph" :mask-closable="false">
        <video id="video" width="480px" height="360px" v-if="!option.img"></video>
        <div style="height: 360px;width: 480px;text-align: center;" v-if="option.img">
            <VueCropper
                    ref="cropper"
                    :img="option.img"
                    :outputSize="option.size"
                    :outputType="option.outputType"
                    :info="true"
                    :autoCropWidth="option.autoCropWidth"
                    :autoCropHeight="option.autoCropHeight"
                    :full="option.full"
                    :canMove="option.canMove"
                    :canMoveBox="option.canMoveBox"
                    :original="option.original"
                    :autoCrop="option.autoCrop"
                    :fixed="option.fixed"
                    :fixedNumber="option.fixedNumber"
                    :centerBox="option.centerBox"
                    :infoTrue="option.infoTrue"
                    :fixedBox="option.fixedBox"
            ></VueCropper>
        </div>
        <canvas style="display: none" id="canvasCamera" width="500" height="500"></canvas>
        <div slot="footer">
            <input type="file" style="width: 40%" :value="fileValue" id="upImageFile" @change="chooseImage">
            <Button type="info" @click="changeDevice">切换</Button>
            <Button type="warning" @click="rephotograph">重拍</Button>
            <Button type="primary" @click="setImage">拍照</Button>
            <Button type="success" @click="confirmSubmit">确认</Button>
        </div>
    </Modal>
</template>

<script>
	import {VueCropper} from 'vue-cropper'

	export default {
		name: "photograph",
		components: {VueCropper},
		props: {
			value: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
                videoArr: [],
                videoIndex: 0,

                uploadAvatarShow: false,//头像图片文件导入
                fileValue:"",
                iconBase64:"",
				show: this.value,
				imgUrl: "",
				cropperDialogVisible: false,
				// 裁剪组件的基础配置option
				option: {
					img: '', // 裁剪图片的地址
					info: true, // 裁剪框的大小信息
					outputSize: 0.8, // 裁剪生成图片的质量
					outputType: 'png', // 裁剪生成图片的格式
					canScale: false, // 图片是否允许滚轮缩放
					autoCrop: true, // 是否默认生成截图框
					autoCropWidth: 150, // 默认生成截图框宽度
					autoCropHeight: 200, // 默认生成截图框高度
					canMove: true,
					fixedBox: false, // 固定截图框大小 不允许改变
					fixed: false, // 是否开启截图框宽高固定比例
					// fixedNumber: [1, 1], // 截图框的宽高比例
					full: true, // 是否输出原图比例的截图
					canMoveBox: false, // 截图框能否拖动
					original: false, // 上传图片按照原始比例渲染
					centerBox: false, // 截图框是否被限制在图片里面
					infoTrue: false, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
					stream:null,
				}
			}
		},
        created(){
            this.getVideoArr();
        },
		methods: {
			//关闭弹框
			closeModal(val) {
				this.$emit('input', val);
			},
            //获取音频、摄像头
            getVideoArr(){
                navigator.mediaDevices.enumerateDevices().then((devices)=> {
                    this.videoArr = [];
                    devices.forEach((device)=> {
                        //音频是audioautput  摄像头videoinput
                        if(device.kind == 'videoinput'){
                            this.videoArr.push({
                                'label': device.label,
                                'id': device.deviceId
                            })
                        }
                    });
                }).catch(function(err) {
                    layer.msg(err.name + ": " + err.message);
                });
            },
            //切换摄像头
            changeDevice(){
			    if(this.videoArr && this.videoArr.length>0){
			        let length = this.videoArr.length-1;
			        if(length==this.videoIndex && this.videoIndex!=0){
                        this.videoIndex = this.videoIndex - 1;
                        this.setDevice();
                    }else if(length>this.videoIndex && this.videoIndex==0){
                        this.videoIndex = this.videoIndex + 1;
                        this.setDevice();
                    }else{
                        this.setDevice();
                    }
                }
            },
            setDevice(){
                if(this.videoArr[this.videoIndex] && this.videoArr[this.videoIndex].id){
                    this.setCurrentDevice(this.videoArr[this.videoIndex].id);
                }
            },
            setCurrentDevice(val){
                const videoConstraints = {};
                if (val === '') {
                    videoConstraints.facingMode = 'environment';
                } else {
                    videoConstraints.deviceId = { exact: val };
                }
                var constraints = {
                    video: videoConstraints,
                };
                this.getUserMedia(constraints);
            },
            getUserMedia(constraints, success, error) {
			    let _this = this;
                if (navigator.mediaDevices.getUserMedia) {
                    //最新的标准API
                    navigator.mediaDevices.getUserMedia(constraints).then(success=>{
                        if(!_this.thisVideo){
                            _this.thisVideo = document.getElementById('video');
                        }
                        // 旧的浏览器可能没有srcObject
                        if (_this.thisVideo && (!_this.thisVideo.srcObject ||'srcObject' in _this.thisVideo ) ) {
                            _this.thisVideo.srcObject = success
                        } else {
                            // 避免在新的浏览器中使用它，因为它正在被弃用。
                            _this.thisVideo.src = window.URL.createObjectURL(success)
                        }
                        _this.stream = success;
                        _this.thisVideo.onloadedmetadata = function (e) {
                            _this.thisVideo.play()
                        }
                    }).catch(err => {
                        console.log(err);
                        _this.changeDevice();//切换摄像头
                    })

                } else if (navigator.webkitGetUserMedia) {
                    //webkit核心浏览器
                    navigator.webkitGetUserMedia(constraints,success, error)
                } else if (navigator.mozGetUserMedia) {
                    //firfox浏览器
                    navigator.mozGetUserMedia(constraints, success, error);
                } else if (navigator.getUserMedia) {
                    //旧版API
                    navigator.getUserMedia(constraints, success, error);
                }
            },
			// 点击裁剪，这一步是可以拿到处理后的地址
			confirmSubmit() {
				this.$refs.cropper.getCropBlob((data) => {
					if (data) {
						// 上传图片，成功后把图片信息添加进imageList
						var reader = new FileReader()
						reader.readAsDataURL(data)
						reader.onload = () => {
							this.imgUrl = reader.result
							if (!this.imgUrl) {
								this.$Message.error("请点击拍照！")
								return;
							}
							this.$emit('handleSearch', this.imgUrl);
							this.closeModal(false);
						}
					} else {
						this.$message.error('图片错误！')
					}
				})
			},
			getCompetence() {
				var _this = this;
				this.thisVideo = document.getElementById('video');
				// 旧版本浏览器可能根本不支持mediaDevices，我们首先设置一个空对象
				if (navigator.mediaDevices === undefined) {
					navigator.mediaDevices = {};
				}
				// 一些浏览器实现了部分mediaDevices，我们不能只分配一个对象
				// 使用getUserMedia，因为它会覆盖现有的属性。
				// 这里，如果缺少getUserMedia属性，就添加它。
				if (navigator.mediaDevices.getUserMedia === undefined) {
					navigator.mediaDevices.getUserMedia = function (constraints) {
						// 首先获取现存的getUserMedia(如果存在)
						var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.getUserMedia
						// 有些浏览器不支持，会返回错误信息
						// 保持接口一致
						if (!getUserMedia) {
							return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
						}
						// 否则，使用Promise将调用包装到旧的navigator.getUserMedia
						return new Promise(function (resolve, reject) {
							getUserMedia.call(navigator, constraints, resolve, reject)
						})
					}
				}
				var constraints = {audio: false, video: {width: this.videoWidth, height: this.videoHeight, transform: 'scaleX(-1)'}}

				navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
					if(!_this.thisVideo){
						_this.thisVideo = document.getElementById('video');
					}
					// 旧的浏览器可能没有srcObject
					if (_this.thisVideo && (!_this.thisVideo.srcObject ||'srcObject' in _this.thisVideo ) ) {
						_this.thisVideo.srcObject = stream
					} else {
						// 避免在新的浏览器中使用它，因为它正在被弃用。
						_this.thisVideo.src = window.URL.createObjectURL(stream)
					}
					_this.stream = stream;
					_this.thisVideo.onloadedmetadata = function (e) {
						_this.thisVideo.play()
					}
				}).catch(err => {
					console.log(err);
					_this.changeDevice();//切换摄像头
				})
			},
			//  绘制图片（拍照功能）
			setImage() {
				this.thisCancas = document.getElementById("canvasCamera");
				this.thisContext = this.thisCancas.getContext("2d");
				//清空上一次的
				this.thisContext.clearRect(0,0,this.thisCancas.width,this.thisCancas.height);
				this.thisVideo = document.getElementById('video');

				var _this = this;
				// 点击，canvas画图
				_this.thisContext.drawImage(
						_this.thisVideo,
						0,
						0,
						500,
						500
				);
				// 获取图片base64链接
				var image = this.thisCancas.toDataURL("image/png");
				this.option.img = image;

			},
			// 关闭摄像头
			stopNavigator () {
				if(this.stream){
					this.stream.getTracks()[0].stop();
				}
				this.stream = null;
				//this.$router.go(0);  //刷新路由
			},
			//重拍
			rephotograph(){
				this.option.img='';
				//关闭
				this.stopNavigator();
				//在开启
				this.getCompetence();
			},
            //获取本地图片
            chooseImage(){
                let files = document.getElementById('upImageFile').files[0];
                this.ImageToBase64(files);
            },
            //将本地图片转化为Base64
            ImageToBase64(files){
                if(files){
                    let _this = this;
                    var reader = new FileReader()
                    reader.readAsDataURL(files)
                    reader.onload =() => {
                        _this.iconBase64 = reader.result
                        // 获取图片base64链接
                        _this.option.img = _this.iconBase64;
                    }
                }else{
                    this.$message.error('图片错误！')
                }
            },
		},
		watch: {
			value(val) {
				this.show = val;
			},
			show(val) {
				if (val) {
				    this.videoIndex = 0;
					this.option = {
						img: '', // 裁剪图片的地址
						info: true, // 裁剪框的大小信息
						outputSize: 0.8, // 裁剪生成图片的质量
						outputType: 'png', // 裁剪生成图片的格式
						canScale: false, // 图片是否允许滚轮缩放
						autoCrop: true, // 是否默认生成截图框
						autoCropWidth: 150, // 默认生成截图框宽度
						autoCropHeight: 200, // 默认生成截图框高度
						canMove: true,
						fixedBox: false, // 固定截图框大小 不允许改变
						fixed: false, // 是否开启截图框宽高固定比例
						// fixedNumber: [1, 1], // 截图框的宽高比例
						full: true, // 是否输出原图比例的截图
						canMoveBox: false, // 截图框能否拖动
						original: false, // 上传图片按照原始比例渲染
						centerBox: false, // 截图框是否被限制在图片里面
						infoTrue: false // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
					}
					this.getCompetence();
					this.imgUrl = "";
				} else {
					this.stopNavigator();
					this.closeModal(val);
				}
			}
		}
	}
</script>

<style lang="less">
    .photograph {
        .ivu-modal {
            width: 520px !important;
        }

    }
</style>
