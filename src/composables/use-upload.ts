export function useUpload(form, key = 'deployedImagePath') {
    const auth = useAuthStore()
    const uploading = ref(false)
    const tmpFileList = ref<{
        uid: number,
        name: string,
        url: string,
        status: string,
        type: string
    }[]>([])
    const _fileList = reactive<{
        uid: number,
        name: string,
        url: string,
        status: string,
        type: string
    }[]>([])
    const uploadUrl = ref(baseUrl + 'common/api/v1/oss-files')
    watch(() => form[key], (value) => {
        _fileList.length = 0
        //组件会生成一个tmp文件链接，需删除
        if (value && value.indexOf('tmp') > 0) return
        _fileList.push(...value ? value.split(';').map((v, index) => {
            return {
                uid: new Date().getTime(),
                name: new Date().getTime() + '.png',
                url: v,
                status: 'success',
                type: 'image'
            }
        }) : [])
    }, {
        immediate: true
    })
    function beforeXhrUpload(taroUploadFile, options) {
        uploading.value = true
        taroUploadFile({
            url: options.url,
            filePath: options.taroFilePath,
            name: 'file',
            header: {
                Authorization: `Bearer ${auth.authInfo.id_token}`,
                'accept-language': 'zh-CN'
            },
            success(response: { errMsg: any; statusCode: number; data: string }) {
                if (response.statusCode === 201) {
                    let data = JSON.parse(response.data)
                    options.onSuccess?.(response, options);
                    _fileList.push({
                        uid: new Date().getTime(),
                        name: new Date().getTime() + '.png',
                        url: data.urlPath,
                        status: 'success',
                        type: 'image'
                    })
                    //组件会生成一个tmp文件链接，需删除
                    tmpFileList.value = _fileList.filter(v => !v.hasOwnProperty('percentage'))
                    _fileList.length = 0
                    _fileList.push(...tmpFileList.value)
                    uploading.value = false
                } else {
                    options.onFailure?.(response, options);
                }
            },
            fail(e: any) {
                options.onFailure?.(e, options);
            }
        })

    }
    function deleteFiles({ files, fileList, index }) {
        let tempFileList = JSON.parse(JSON.stringify(fileList))
        _fileList.length = 0
        _fileList.push(...tempFileList)
        console.log(files, index)
    }
    return {
        uploadUrl,
        beforeXhrUpload,
        uploading,
        deleteFiles,
        _fileList
    }
}