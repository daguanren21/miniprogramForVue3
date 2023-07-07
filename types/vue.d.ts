
export { }
declare module "vue" {
    export interface GlobalComponents {
        JxTabBar: typeof import('../src/components/jx-tab-bar.vue')['default']
    }
}