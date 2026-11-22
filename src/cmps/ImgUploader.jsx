import PropTypes from 'prop-types'
import { useState } from 'react'
import { uploadService } from '../services/upload.service'
import { showErrorMsg } from '../services/event-bus.service'

export function ImgUploader({ onUploaded = null }) {
    const [imgData, setImgData] = useState({ imgUrl: null, height: 500, width: 500 })
    const [isUploading, setIsUploading] = useState(false)

    async function onUploadImg(ev) {
        setIsUploading(true)
        try {
            const { secure_url, height, width } = await uploadService.uploadImg(ev)
            setImgData({ imgUrl: secure_url, width, height })
            onUploaded?.(secure_url)
        } catch (err) {
            showErrorMsg('Cannot upload image')
        } finally {
            setIsUploading(false)
        }
    }

    function getUploadLabel() {
        if (imgData.imgUrl) return 'Upload Another?'
        return isUploading ? 'Uploading....' : 'Upload Image'
    }

    return (
        <div className="img-uploader">
            {imgData.imgUrl && <img src={imgData.imgUrl} alt="Uploaded preview" />}
            <label htmlFor="imgUpload">{getUploadLabel()}</label>
            <input type="file" onChange={onUploadImg} accept="image/*" id="imgUpload" disabled={isUploading} />
        </div>
    )
}

ImgUploader.propTypes = {
    onUploaded: PropTypes.func,
}
