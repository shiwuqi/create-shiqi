import React, { FC } from 'react'
import { Upload, Button } from 'antd'
import { UploadProps } from 'antd/es/upload'

interface props extends UploadProps {
    className?: string,
    style?: object,
    render?: () => JSX.Element
}

const FRUpload: FC<props> = (props) => {

    const {
        render = defaultRender
    } = props

    function defaultRender() {
        return <Button>Upload</Button>
    }

    return <Upload { ...props }>{ render() }</Upload>
}

export default FRUpload