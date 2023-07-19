export function useUpload(form) {
    const auth = useAuthStore()
    const _fileList = ref<{
        uid: number,
        name: string,
        url: string,
        status: string,
        type: string
    }[]>([])
    const uploadUrl = ref(baseUrl + 'common/api/v1/oss-files')
    watch(() => form.deployedImagePath, (value) => {
        _fileList.value = value ? value.split(';').map((v, index) => {
            return {
                uid: index,
                name: index + '.png',
                url: v,
                status: 'success',
                type: 'image'
            }
        }) : []
    }, {
        immediate: true
    })
    function beforeXhrUpload(taroUploadFile, options) {
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
                    _fileList.value = _fileList.value.filter(v => !v.hasOwnProperty('percentage'))
                    console.log(_fileList.value)
                    _fileList.value.push({
                        uid: _fileList.value.length,
                        name: _fileList.value.length + '.png',
                        url: data.urlPath,
                        status: 'success',
                        type: 'image'
                    })
                    options.onSuccess?.(response, options);
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
        _fileList.value = fileList
        console.log(files, fileList, index)
    }
    return {
        uploadUrl,
        beforeXhrUpload,
        deleteFiles,
        _fileList
    }
}