
export const useStep = (props, emits, form) => {
    const _current = ref(0)
    const columns = ref<{ text: string, value: string }[]>()
    const manage = useManageStore()
    watch(() => props.current, (val) => {
        _current.value = val
    }, {
        immediate: true
    })
    function next() {
        Object.keys(form).forEach(i => {
            manage.$state.deviceInfo[i] = form[i]
        })
        emits('change', _current.value + 1)
    }
    function prev() {
        Object.keys(form).forEach(i => {
            manage.$state.deviceInfo[i] = form[i]
        })
        emits('change', _current.value - 1)
    }
    //日期POP弹出框
    const datePop = reactive({
        show: false,
        key: 'batteryInvalidDate',
        value: new Date(Date.now()),
        methods: {
            confirm({ selectedValue, selectedOptions }) {
                console.log(selectedValue)
                datePop.value = selectedOptions.map((val: any) => val.text).join('')
                form[datePop.key] = selectedOptions.map((val: any) => val.text).join('-')
                datePop.show = false
            }
        }
    })
    //下拉选POP弹出框
    const selectPop = reactive({
        show: false,
        key: '',
        value: [] as string[],
        methods: {
            confirm({ selectedValue, selectedOptions }) {
                console.log(selectedValue)
                form[selectPop.key + 'Name'] = selectedOptions.map((val: any) => val.text).join('')
                form[selectPop.key] = selectedOptions.map((val: any) => val.value).join('')
                selectPop.show = false
            }
        }
    })

    return {
        next,
        datePop,
        selectPop,
        columns,
        prev
    }
}