import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getSingleProduct, updateProduct } from '../../apis/Api'
import { toast } from 'react-toastify'
import './UpdateProducts.css'

const UpdateProducts = () => {
    const { id } = useParams()

    useEffect(() => {
        getSingleProduct(id).then((res) => {
            setProductName(res.data.product.productName)
            setProductPrice(res.data.product.productPrice)
            setProductCategory(res.data.product.productCategory)
            setProductDescription(res.data.product.productDescription)
            setOldImage(res.data.product.productImage)
        }).catch((error) => {
            console.log(error)
        })
    }, [id])

    const [productName, setProductName] = useState('')
    const [productPrice, setProductPrice] = useState('')
    const [productCategory, setProductCategory] = useState('')
    const [productDescription, setProductDescription] = useState('')
    const [productNewImage, setProductNewImage] = useState(null)
    const [previewNewImage, setPreviewNewImage] = useState(null)
    const [oldImage, setOldImage] = useState('')

    const handleImage = (event) => {
        const file = event.target.files[0]
        setProductNewImage(file)
        setPreviewNewImage(URL.createObjectURL(file))
    }

    const handleUpdate = (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append('productName', productName)
        formData.append('productPrice', productPrice)
        formData.append('productCategory', productCategory)
        formData.append('productDescription', productDescription)
        if (productNewImage) {
            formData.append('productImage', productNewImage)
        }

        updateProduct(id, formData).then((res) => {
            if (res.status === 201) {
                toast.success(res.data.message)
            }
        }).catch((error) => {
            if (error.response.status === 500) {
                toast.error(error.response.data.message)
            } else if (error.response.status === 400) {
                toast.error(error.response.data.message)
            }
        })
    }

    return (
        <div className='container mt-5'>
            <div className='card p-4 shadow-lg'>
                <h2 className='text-black'>Update Product for <span className='text-primary'>{productName}</span></h2>
                <div className='d-flex gap-5 mt-4'>
                    <form onSubmit={handleUpdate} className='w-50'>
                        <div className='mb-4'>
                            <label className='form-label text-black'>Product Name</label>
                            <input value={productName} onChange={(e) => setProductName(e.target.value)} className='form-control' type="text" placeholder='Enter your product name' />
                        </div>

                        <div className='mb-4'>
                            <label className='form-label text-black'>Product Price</label>
                            <input value={productPrice} onChange={(e) => setProductPrice(e.target.value)} className='form-control' type="number" placeholder='Enter your product price' />
                        </div>

                        <div className='mb-4'>
                            <label className='form-label text-black'>Choose Category</label>
                            <select value={productCategory} onChange={(e) => setProductCategory(e.target.value)} className='form-control'>
                                <option value="tv">TV</option>
                                <option value="Small Appliances">Small Appliances</option>
                                <option value="Big Appliances">Big Appliances</option>
                                <option value="Solar">Solar</option>
                                <option value="Kitchen Appliances">Kitchen Appliances</option>
                                <option value="Air conditioner">Air Conditioner</option>
                            </select>
                        </div>

                        <div className='mb-4'>
                            <label className='form-label text-black'>Enter Description</label>
                            <textarea value={productDescription} onChange={(e) => setProductDescription(e.target.value)} className='form-control' rows="3"></textarea>
                        </div>

                        <div className='mb-4'>
                            <label className='form-label text-black'>Choose Product Image</label>
                            <input onChange={handleImage} type="file" className='form-control' />
                        </div>

                        <button type='submit' className='btn btn-primary w-100'>Update Product</button>
                    </form>

                    <div className='image-section'>
                        <h6 className='text-black'>Previewing Old Image</h6>
                        <img height={'200px'} width={'300px'} className='img-fluid rounded-4 object-fit-cover mb-3' src={`https://localhost:5000/products/${oldImage}`} alt="Old Product" />
                        {previewNewImage && (
                            <>
                                <h6 className='text-black'>New Image</h6>
                                <img height={'200px'} width={'300px'} className='img-fluid rounded-4 object-fit-cover' src={previewNewImage} alt="New Product Preview" />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpdateProducts
