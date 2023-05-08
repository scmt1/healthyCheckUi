const theme = {
    state: {
        theme: {
            mainTheme: "black", // primary light darkmode
            menuTheme: "light", // 侧边菜单主题 darkblue light dark black
            navTheme: "black", // 导航栏主题 light darkblue primary black
            menuWidth: 0, // 侧边菜单宽度
            navType: "3", // 导航菜单展示方式 1菜单模式 2单个下拉菜单 3图标
            sliceNum: 10, // 导航菜单顶部菜单模式时默认显示个数
            navShowType: "app", // 下拉菜单展示方式 app图标 list列表（navType 1、3）
            showNavMenuIcon: true, // 是否显示图标（navType 1）
            fixNav: true, // 是否固定顶部导航
            showFold: false, // 显示折叠菜单图标
            showLogo: true, // 是否显示Logo
            showTags: false, // 是否显示多标签
            showSearch: false, // 是否显示搜索菜单
            showFooter: false, // 是否显示页脚
            weakMode: false, // 色弱模式
            shrink: false, //是否收起菜单
            leftWidth: 0,
            processShow: 0,//首页是否显示进度
        }
    },
    mutations: {
        setTheme(state, v) {
            if (v && v != "undefined") {
                state.theme = JSON.parse(v);
                localStorage.theme = JSON.stringify(state.theme);
            }
        },
        setMainTheme(state, v) {
            state.theme.mainTheme = v;
            localStorage.theme = JSON.stringify(state.theme);
        },
        setMenuTheme(state, v) {
            state.theme.menuTheme = v;
            localStorage.theme = JSON.stringify(state.theme);
        },
        setNavTheme(state, v) {
            state.theme.navTheme = v;
            localStorage.theme = JSON.stringify(state.theme);
        },
        setMenuWidth(state, v) {
            state.theme.menuWidth = v;
            localStorage.theme = JSON.stringify(state.theme);
        },
        setNavType(state, v) {
            state.theme.navType = v;
            localStorage.theme = JSON.stringify(state.theme);
        },
        setSliceNum(state, v) {
            state.theme.sliceNum = v;
            localStorage.theme = JSON.stringify(state.theme);
        },
        setNavShowType(state, v) {
            state.theme.navShowType = v;
            localStorage.theme = JSON.stringify(state.theme);
        },
        setShowNavMenuIcon(state, v) {
            state.theme.showNavMenuIcon = v;
            localStorage.theme = JSON.stringify(state.theme);
        },
        setFixNav(state, v) {
            state.theme.fixNav = v;
            localStorage.theme = JSON.stringify(state.theme);
        },
        setShowFold(state, v) {
            state.theme.showFold = v;
            localStorage.theme = JSON.stringify(state.theme);
        },
        setShowLogo(state, v) {
            state.theme.showLogo = v;
            localStorage.theme = JSON.stringify(state.theme);
        },
        setShowTags(state, v) {
            state.theme.showTags = v;
            localStorage.theme = JSON.stringify(state.theme);
        },
        setShowSearch(state, v) {
            state.theme.showSearch = v;
            localStorage.theme = JSON.stringify(state.theme);
        },
        setShowFooter(state, v) {
            state.theme.showFooter = v;
            localStorage.theme = JSON.stringify(state.theme);
        },
        setWeakMode(state, v) {
            state.theme.weakMode = v;
            localStorage.theme = JSON.stringify(state.theme);
        },
        setShrink(state, v) {
            state.theme.shrink = v;
            localStorage.theme = JSON.stringify(state.theme);
        },
        setLeftWidth(state, v) {
            state.theme.leftWidth = v;
            localStorage.theme = JSON.stringify(state.theme);
        },
        setProcessShow(state, v) {
            state.theme.processShow = v;
            localStorage.theme = JSON.stringify(state.theme);
        },
        setPhysicalType(state, v) {
            state.theme.physicalType = v;
            localStorage.theme = JSON.stringify(state.theme);
        }
    }
};

export default theme;
