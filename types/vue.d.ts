
export { }
declare module "vue" {
    export interface GlobalComponents {
        DeviceInfoModal: typeof import('./src/components/device-info-modal/index.vue')['default']
        JxDot: typeof import('./src/components/jx-dot/index.vue')['default']
        JxIcon: typeof import('./src/components/jx-icon/index.vue')['default']
        JxNavBar: typeof import('./src/components/jx-nav-bar/index.vue')['default']
        JxScrollView: typeof import('./src/components/jx-scroll-view/index.vue')['default']
        JxTabBar: typeof import('./src/components/jx-tab-bar/index.vue')['default']
    }
}