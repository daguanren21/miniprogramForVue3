
export const useStep = (props,emits) => {
    const _current = ref(0)
   
    watch(() => props.current, (val) => {
        _current.value = val
    }, {
        immediate: true
    })
    function next() {
        console.log(_current.value)
        emits('change', _current.value + 1)
    }
    return {
        next
    }
}