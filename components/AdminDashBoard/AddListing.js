/* eslint-disable */
import Link from "next/link";

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Formik } from "formik";
import * as yup from "yup";
import { useMutation } from "react-query";
import useCities from "../../utils/Hooks/useCities";
import useFacilites from "../../utils/Hooks/useFacilities";
import { useAuthToken } from "../../contexts/authContext";
import listingApi from "../../utils/Api/listing.api";
import Loading from "../Shared/Loading";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const UploadComponent = ({
  fieldName,
  setFieldValue,
  value,
  title,
  errors,
}) => {
  const [previewFiles, setPreviewFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      console.log(acceptedFiles);
      setFieldValue(fieldName, acceptedFiles);
      setPreviewFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
     
    },
  });
  const thumbs = previewFiles.map((file) => (
    <div key={file.name} className="drop-gallery-thumb">
      <img src={file.preview} />
    </div>
  ));
  return (
    <div {...getRootProps()} className="dropzone add-listings-box">
      <h3 className={`${errors && errors[fieldName] ? "text-danger" : ""}`}>
        {(errors && errors[fieldName]) ?? title}
      </h3>
      {previewFiles.length > 0 ? (
        <div className="gallery-flex">
          {thumbs}
          <input name={fieldName} {...getInputProps()} />
        </div>
      ) : (
        <div className="file-upload-box">
          <input name={fieldName} {...getInputProps()} />
          <p>Drag n drop some files here, or click to select files</p>
        </div>
      )}
    </div>
  );
};

const AddListing = () => {
  const { cities } = useCities();
  const { features } = useFacilites();
  const router = useRouter();
  const token = useAuthToken();
  const { mutate, isLoading } = useMutation({
    mutationFn: (data) => listingApi.addNewListing(data, token),
    mutationKey: "addNewLising",
    onSuccess: (data) => {
      toast.success(data.data.name + " Added Successfully");
      router.push("/admin/my-listing");
    },
  });

  return (
    <>
      <div className="main-content d-flex flex-column">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <div className="breadcrumb-area">
              <h1>Add Listings</h1>
              <ol className="breadcrumb">
                <li className="item">
                  <Link href="/dashboard">
                    <a>Home</a>
                  </Link>
                </li>
                <li className="item">
                  <Link href="/dashboard">
                    <a>Dashboard</a>
                  </Link>
                </li>
                <li className="item">Add Listings</li>
              </ol>
            </div>
            <Formik
              initialValues={{
                name: "",
                city: "Select City",
                seoTitle: "",
                feature: [],
                location: {
                  latitude: "",
                  state: "",
                  longitude: "",
                  zip_code: "",
                  address: "",
                },
                description: "",
                hotelSupportNumber: "",
                roomPhotos: [],
                dinningAreaPhotos: [],
                commonAreaPhotos: [],
                coverImage: [],
                googleMapUrl: "",
              }}
              onSubmit={(values, { resetForm }) => {
                const formData = new FormData();
                Object.keys(values).forEach((keys) => {
                  if (
                    keys === "roomPhotos" ||
                    keys === "dinningAreaPhotos" ||
                    keys === "commonAreaPhotos" ||
                    keys === "coverImage"
                  ) {
                    values[keys].forEach((ele) => {
                      formData.append(keys, ele, ele.name);
                    });
                  } else if (keys === "location") {
                    Object.keys(values[keys]).forEach((key) => {
                      formData.append(`${keys}[${key}]`, values[keys][key]);
                    });
                  } else if (keys === "feature") {
                    values[keys].forEach((ele) => {
                      formData.append(keys, ele);
                    });
                  } else formData.append(keys, values[keys]);
                });
                mutate(formData);
                resetForm({
                  name: "",
                  city: "select_city",
                  seoTitle: "",
                  feature: [],
                  location: {
                    latitude: "",
                    state: "",
                    longitude: "",
                    zip_code: "",
                    address: "",
                  },
                  description: "",
                  hotelSupportNumber: "",
                  roomPhotos: [],
                  dinningAreaPhotos: [],
                  commonAreaPhotos: [],
                  coverImage: [],
                  googleMapUrl: "",
                });
              }}
              validationSchema={formValidationSchema}
            >
              {({
                values,
                errors,
                handleChange,
                handleSubmit,
                isSubmitting,
                setFieldValue,

                submitForm,
                /* and other goodies */
              }) => {
                return (
                  <form onSubmit={handleSubmit}>
                    <div className="add-listings-box">
                      <h3>Basic Informations</h3>

                      <div className="row">
                        <div className="col-lg-12 col-md-12">
                          <div className="form-group">
                            <label
                              className={`${errors?.name ? "text-danger" : ""}`}
                            >
                              <i className="bx bx-briefcase-alt"></i>
                              {errors.name ?? "Listing Title:"}
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={values.name}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="Name of your business"
                            />
                          </div>
                        </div>

                        <div className="col-lg-12 col-md-12">
                          <div className="form-group">
                            <label
                              className={`${
                                errors?.seoTitle ? "text-danger" : ""
                              }`}
                            >
                              <i className="bx bx-duplicate"></i>{" "}
                              {errors.seoTitle ?? "Enter Seo Title:"}
                            </label>
                            <input
                              type="text"
                              name="seoTitle"
                              value={values.seoTitle}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="Enter Seo Title"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="add-listings-box">
                      <h3>Location</h3>

                      <div className="row">
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label
                              className={`${errors?.city ? "text-danger" : ""}`}
                            >
                              <i className="bx bx-menu-alt-left"></i>{" "}
                              {errors?.city ?? "City:"}
                            </label>
                            <select
                              value={values.city}
                              name="city"
                              onChange={handleChange}
                              className="dashbaord-category-select"
                            >
                              <option value="select_city">Select City</option>
                              {cities.map(({ _id, name, slug }) => {
                                return (
                                  <option value={slug} key={_id}>
                                    {name}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>

                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label
                              className={`${
                                errors?.location?.address ? "text-danger" : ""
                              }`}
                            >
                              <i className="bx bx-menu-alt-left"></i>
                              {`${errors?.location?.address ?? "Address:"}`}
                            </label>
                            <input
                              type="text"
                              value={values.location.address}
                              name="location.address"
                              onChange={handleChange}
                              className="form-control"
                              placeholder="e.g. 55 County Laois"
                            />
                          </div>
                        </div>

                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label
                              className={`${
                                errors?.location?.state ? "text-danger" : ""
                              }`}
                            >
                              <i className="bx bx-menu-alt-left"></i>
                              {`${errors?.location?.state ?? "State:"}`}
                            </label>
                            <input
                              type="text"
                              value={values.location.state}
                              name="location.state"
                              onChange={handleChange}
                              className="form-control"
                            />
                          </div>
                        </div>

                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label
                              className={`${
                                errors?.location?.zip_code ? "text-danger" : ""
                              }`}
                            >
                              <i className="bx bx-menu-alt-left"></i>{" "}
                              {errors?.location?.zip_code ?? "Zip-Code:"}
                            </label>
                            <input
                              type="text"
                              value={values.location.zip_code}
                              onChange={handleChange}
                              name="location.zip_code"
                              className="form-control"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label
                              className={`${
                                errors?.location?.longitude ? "text-danger" : ""
                              }`}
                            >
                              <i className="bx bx-menu-alt-left"></i>{" "}
                              {errors?.location?.longitude ?? "Longitude:"}
                            </label>
                            <input
                              type="text"
                              value={values.location.longitude}
                              onChange={handleChange}
                              name="location.longitude"
                              className="form-control"
                            />
                          </div>
                        </div>

                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label
                              className={`${
                                errors?.location?.latitude ? "text-danger" : ""
                              }`}
                            >
                              <i className="bx bx-menu-alt-left"></i>{" "}
                              {errors?.location?.longitude ?? "Latitude::"}{" "}
                            </label>
                            <input
                              type="text"
                              value={values.location.latitude}
                              onChange={handleChange}
                              name="location.latitude"
                              className="form-control"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label
                              className={`${
                                errors?.googleMapUrl ? "text-danger" : ""
                              }`}
                            >
                              <i className="bx bx-menu-alt-left"></i>
                              {errors.googleMapUrl ?? "Google Map Url:"}
                            </label>
                            <input
                              type="text"
                              value={values.googleMapUrl}
                              onChange={handleChange}
                              name="googleMapUrl"
                              className="form-control"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {[
                      {
                        field: "coverImage",
                        title: "Add Cover  images (Gallery)",
                      },
                      {
                        field: "roomPhotos",
                        title: "Add Rooms  images (Gallery)",
                      },
                      {
                        field: "commonAreaPhotos",
                        title: "Add Common Area  images (Gallery)",
                      },
                      {
                        field: "dinningAreaPhotos",
                        title: "Add Dinning images (Gallery)",
                      },
                    ].map((ele) => (
                      <UploadComponent
                        key={ele.field}
                        setFieldValue={setFieldValue}
                        fieldName={ele.field}
                        value={values[ele.field]}
                        title={ele.title}
                        errors={errors}
                      />
                    ))}

                    <div className="add-listings-box">
                      <h3>Details</h3>

                      <div className="row">
                        <div className="col-lg-12 col-md-12">
                          <div className="form-group">
                            <label
                              className={`${
                                errors?.description ? "text-danger" : ""
                              }`}
                            >
                              <i className="bx bx-text"></i>{" "}
                              {errors?.description ?? " Description:"}
                            </label>
                            <textarea
                              value={values.description}
                              name="description"
                              onChange={handleChange}
                              cols="30"
                              rows="7"
                              className="form-control"
                              placeholder="Details..."
                            ></textarea>
                          </div>
                        </div>
                        <div className="col-lg-12 col-md-12">
                          <div className="form-group">
                            <label
                              className={`${
                                errors?.hotelSupportNumber ? "text-danger" : ""
                              }`}
                            >
                              <i className="bx bx-phone-call"></i>{" "}
                              {errors?.hotelSupportNumber ?? "Support Number:"}
                            </label>
                            <input
                              type="text"
                              name="hotelSupportNumber"
                              value={values.hotelSupportNumber}
                              onChange={handleChange}
                              className="form-control"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="add-listings-box pb-2">
                      <h3 className={`${errors?.feature ? "text-danger" : ""}`}>
                        {errors?.feature ?? "Facilities"}
                      </h3>

                      <div className="form-group">
                        <ul className="facilities-list">
                          {features.map(({ id, feature_name }) => (
                            <li key={id}>
                              <label className="checkbox">
                                <input
                                  type="checkbox"
                                  name="feature"
                                  value={id}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setFieldValue(
                                        "feature",
                                        values.feature.concat(id)
                                      );
                                    } else {
                                      setFieldValue(
                                        "feature",
                                        values.feature.filter(
                                          (value) => value != id
                                        )
                                      );
                                    }
                                  }}
                                />
                                <span>{feature_name}</span>
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="add-listings-btn">
                      <button
                        disabled={isSubmitting}
                        type="submit"
                        onClick={submitForm}
                      >
                        Submit Listings
                      </button>
                    </div>
                  </form>
                );
              }}
            </Formik>
          </>
        )}
      </div>
    </>
  );
};

const formValidationSchema = yup.object().shape({
  name: yup
    .string()
    .min(5, "Name is too short,it should be more than 5 character")
    .required("Name is Required"),
  city: yup
    .string()
    .notOneOf(["select_city"], "Select a city")
    .required("City is Requied"),
  seoTitle: yup
    .string()
    .min(5, "Seo Title is too short,it should be more than 5 character")
    .required("Seotitle is Required"),
  feature: yup
    .array()
    .of(yup.string())
    .min(1, "Hotel Should have minum one facility"),
  location: yup.object().shape({
    latitude: yup.string().required("Latitude is Required"),
    longitude: yup.string().required("Longitude is Required"),
    state: yup.string().required("State is Required"),
    zip_code: yup.string().required("Zip Code is Required"),
    address: yup.string().required("Address is Required"),
  }),
  description: yup
    .string()
    .min(5, "Description is too short,it should be more than 5 character")
    .required("Description is Required"),
  hotelSupportNumber: yup
    .string()
    .min(5, "Support number is too short,it should be more than 5 character")
    .required("Support Number is Required"),
  googleMapUrl: yup.string().url().required("Map Url is Required"),
  roomPhotos: yup.array().min(1, "There should be minimum 1 picture"),
  dinningAreaPhotos: yup.array().min(1, "There should be minimum 1 picture"),
  commonAreaPhotos: yup.array().min(1, "There should be minimum 1 picture"),
  coverImage: yup.array().min(1, "There should be minimum 1 picture"),
});

export default AddListing;
