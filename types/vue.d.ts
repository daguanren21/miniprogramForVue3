
export { }
declare module "vue" {
    export interface GlobalComponents {
        DeviceInfoModal: typeof import('../src/components/device-info-modal/index.vue')['default']
        JxDot: typeof import('../src/components/jx-dot/index.vue')['default']
        JxNavBar: typeof import('../src/components/jx-nav-bar/index.vue')['default']
        JxTabBar: typeof import('../src/components/jx-tab-bar/index.vue')['default']
    }
}