/**
 * 
 * @description  校验
 */
export const useNotify = (type: 'primary' | 'success' | 'danger' | 'warning' = 'primary') => {
    const state = reactive({
        show: false,
        desc: '',
        type: type
    })
    const notify = (desc: string) => {
        state.show = true;
        state.desc = desc
    }
    return {
        state,
        notify
    }
}