"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import Image from "next/image";
import axios from "axios";
import { BASE_API_URL } from "../constant/baseUri";
import { title } from "process";
import { ProductType } from "@/type/productType";

const FILE_SIZE = 1024 * 1024 * 5; // 5MB
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png", "image/gif"];

function functionAlert() {
  alert("Edit Products Successfully");
}

// fix some error here

const validationSchema = Yup.object().shape({
  // image: Yup.mixed()
  //   .test("fileSize", "File too large", (value: any) => {
  //     if (!value) {
  //       return true;
  //     }
  //     return value.size <= FILE_SIZE;
  //   })
  //   .test("fileFormat", "Unsupported Format", (value: any) => {
  //     if (!value) {
  //       return true;
  //     }
  //     return SUPPORTED_FORMATS.includes(value.type);
  //   })
    // .required("Required"),
});

const fieldStyle = "border border-gray-300 rounded-md";

// export function EditProductForm({ title, price, image, description, qty, selectedProduct }: ProductType & { selectedProduct: { id: string } }) {

function EditProductForm({
  id,
  title,
  price,
  image,
  description,
  qty,
}: ProductType) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE0NjcwNTg1LCJpYXQiOjE3MTI1MTA1ODUsImp0aSI6ImMwODU4MTFmZjNiNDRlNWU5YWUyNmQzOGI0OTNlNGYyIiwidXNlcl9pZCI6MTJ9.1FUM8l1yAQ65-TtNYD-UvUGNBrByltpGtPf1mcNhQpQ");
  myHeaders.append("Cookie", "csrftoken=ntSoeTzPXCbcUJyd4RYyQIIBQLulVNUHhpym1naPEocO7Uh46cH9pCBQ5J8u2jJT; sessionid=lt5uxhco8ur6sgu1v51bcrje4s8javez");
  const axiosCompatibleHeaders : {[key:string]: string} ={};
  myHeaders.forEach((value, key) => {
    axiosCompatibleHeaders[key] = value;
  });
  const handleUpdateProduct = async (values: any, imageData: any) => {

    console.log("This iss the selecte4dProduct ID : ", id)
    console.log("This is the valuesssswss : ", values)
    try {
      // Send the image data to the server
      const imageUrl = await handleSubmitToServer(imageData);
      const response = await axios.put(
        `${BASE_API_URL}products/${id}`,
        {
          ...values,
          image: imageUrl,
        },
        {
          headers: axiosCompatibleHeaders
        },
      );
      // const response = await fetch(`${BASE_API_URL}products/${id}`, {
      //   method: "PUT",
      //   headers: myHeaders,
      //   body: JSON.stringify({
      //     ...values,
      //     image: imageUrl,
      //   }),
      // });

      console.log("Updated product:", response.data);
    } catch (error) {
      console.log(error);
    }
  };

  
  const handleSubmitToServer = async (values: any) => {
    try {
      const response = await axios.post(
        `${BASE_API_URL}file/product/`,
        values.image
      );
      return response.data.image;
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateProduct = async (values: any, imageData: any) => {
    try {
      const imageUrl = await handleSubmitToServer(imageData);
      console.log("data: ", values);
      const postData = await fetch(`${BASE_API_URL}products/`, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          ...values,
          image: imageUrl,
        }),
      });
      console.log("post data: ", postData);
    } catch (error) {
      console.log(error);
    }
  };

  const [previewImage, setPreviewImage] = useState("");
  return (
    <div className="w-full pt-9">
      <Formik
        onSubmit={(values: any, { setSubmitting, resetForm }) => {
          const formData = new FormData();
          formData.append("image", values.image);
          handleUpdateProduct(values, { image: formData });
          setSubmitting(false);
          resetForm();
        }}
        validationSchema={validationSchema}
        initialValues={{
          name: title,
          desc: description,
          image: image,
          price: price,
          quantity: qty,
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form className="flex m-[30px] flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="name">Product Name: </label>
              <Field
                placeholder={title}
                className={fieldStyle}
                name="name"
                type="text"
              />
            </div>
            {/* description */}
            <div className="flex flex-col gap-2">
              <label htmlFor="desc">Description: </label>
              <Field
                placeholder={description}
                className={fieldStyle}
                name="desc"
                type="text"
              />
            </div>
            {/* price */}
            <div className="flex flex-col gap-2">
              <label htmlFor="price">Price: </label>
              <Field
                placeholder={price}
                className={fieldStyle}
                name={price}
                type="number"
              />
            </div>
            {/* quantity */}
            <div className="flex flex-col gap-2">
              <label htmlFor="quantity">Quantity: </label>
              <Field
                placeholder={qty}
                className={fieldStyle}
                name="quantity"
                type="number"
              />
              <div>
                <div className="flex flex-col gap-4 justify-center">
                  <input
                    type="file"
                    name="image"
                  
                    onChange={(event) => {
                      if (event.target.files && event.target.files.length > 0) {
                        var file = event.target.files[0];
                        setPreviewImage(URL.createObjectURL(file));
                      }
                    }}
                    className="border border-gray-300 rounded-md"
                  />

                  <Image
                    width={500}
                    height={500}
                    src={previewImage ? previewImage : image as string }
                    className="w-[400px] h-[300px]"
                    alt="image_product"
                  />
                </div>

                <ErrorMessage name="image">
                  {(msg) => <div className="text-danger">{msg}</div>}
                </ErrorMessage>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full px-4 py-3 bg-[#ED6533] text-white rounded-md"
                disabled={isSubmitting}
                onClick={() => functionAlert()}
              >
                Update
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default EditProductForm;
