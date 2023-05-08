<template>
    <div style="display: inline-block">
        <Dropdown transfer trigger="hover" @on-click="handleClickUserDropdown">
            <div style="display: inline-block">
                <div class="header-right-icon header-user header-action">
                    <Avatar v-if="avatar" :src="avatar" size="small"></Avatar>
                    <Avatar v-else icon="md-person" size="small"></Avatar>
                    <span class="header-username">{{ nickname }}</span>
                </div>
            </div>
            <DropdownMenu slot="list">
                <DropdownItem name="ownSpace">
                    <Icon type="md-person" style="margin: 0 10px 0 0"/>
                    {{ $t("userCenter") }}
                </DropdownItem>
                <DropdownItem name="changePass">
                    <Icon type="md-unlock" style="margin: 0 10px 0 0"/>
                    {{ $t("changePass") }}
                </DropdownItem>
                <DropdownItem name="loginout" divided>
                    <Icon type="md-log-out" style="margin: 0 10px 0 0"/>
                    {{ $t("logout") }}
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>

        <!-- 修改密码 -->
        <changePass v-model="showChangePass"/>
    </div>
</template>

<script>
    import util from "@/libs/util.js";
    import changePass from "@/views/change-pass/change-pass";

    export default {
        name: "user",
        components: {
            changePass,
        },
        props: {},
        computed: {
            nickname() {
                return this.$store.state.user.nickname;
            },
            avatar() {
                let avatar = this.$store.state.user.avatar;
                if(avatar) {
                    return avatar;
                }else {
                    return localStorage.getItem("avatar")
                }
            },
        },
        data() {
            return {
                showChangePass: false,
            };
        },
        methods: {
            init() {
                let avatar = this.$store.state.user.avatar;
                if(avatar) {
                    localStorage.setItem("avatar", avatar);
                }
            },
            handleClickUserDropdown(name) {
                if (name == "ownSpace") {
                    util.openNewPage(this, "ownspace_index");
                    this.$router.push({
                        name: "ownspace_index",
                    });
                } else if (name == "changePass") {
                    this.showChangePass = true;
                } else if (name == "loginout") {
                    this.$Modal.confirm({
                        title: '系统提示',
                        content: '确定注销并退出系统吗？',
                        onOk: () => {
                            // 退出登录
                            this.$store.commit("logout", this);
                            this.setStore("accessToken", "");
                            // 强制刷新页面 重新加载router
                            location.reload();
                        },
                        onCancel: () => {
                        }
                    });
                }
            },
        },
        mounted() {
            this.init();
        },
    };
</script>

<style lang="less" scoped>
</style>
