import React from 'react'
import { useForm } from 'react-hook-form';
import { useState ,useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const Edit = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [book, setBook] = useState("")
  const {id}=useParams()
  const navigate=useNavigate()
  const getData=async()=>{
    try {
      const response = await fetch(`http://localhost:8080/${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        credentials: 'include' 
      });
      const result = await response.json();
      setBook(result)
      setValue(result.name);
      setValue(result.author)
      console.log(result);

    }catch(err){
        console.log(err);
      }
  }
  useEffect(() => {
    getData();
  }, []);

  const onSubmit=async(formData)=>{
    try {
      const response = await fetch(`http://localhost:8080/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',  // Include credentials (cookies),
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      console.log("Data updated successfully:", result);
      alert("Book updated Successfully!")
      navigate("/")
    } catch (error) {
      console.error("Error updating data:", error);
    }
  }
  return (
    <div className="text-center mx-[32%] my-[6%]">
      <form
        className="rounded-[30px] p-4 pt-8 px-0 w-[500px] h-[350px] bg-amber-200 border-2 border-amber-900"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-center text-3xl mb-8 mt-2 font-bold text-amber-900">Edit Book here!</h1>
        <input
          type="text"
          className="border border-black rounded-md p-1 mb-2 w-60"
          placeholder="Book Name"
          defaultValue={book.name}
          {...register("name", {
            minLength: { value: 3, message: "Name is too small" },
            onChange: (e) => setBook({ ...book,name: e.target.value })
          })}
        />
        {errors.name ? (
          <div className="text-red-600">{errors.name.message}</div>
        ):<br/>}
        <br />
        <input
          type="text"
          className="border border-black rounded-md p-1 mb-2 w-60"
          placeholder="Author Name"
          defaultValue={book.author}
          {...register("author", {
            minLength: { value: 3, message: "Author name is too small" },
            maxLength: { value: 24, message: "Author name is too big" },
            onChange: (e) => setData({ ...book, author: e.target.value })
          })}
        />
        {errors.author ? (
          <div className="text-red-600">{errors.author.message}</div>
        ):<br/>}
        <br />
        <input
          type="text"
          className="border border-black rounded-md p-1 mb-2 w-60"
          placeholder="Image URL"
          defaultValue={book.imageLink}
          {...register("imageLink")}
        />
        <br />
        <input
          type="submit"
          className="border border-white rounded-md bg-amber-900 text-white p-1 px-2 mt-2"
          value="Edit"
        />
      </form>
    </div>
  )
}

export default Edit