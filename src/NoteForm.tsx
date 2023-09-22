import{Form,Stack,Row,Col,Button} from "react-bootstrap";
import CreatableReactSelect from "react-select/creatable"
import {Link} from "react-router-dom"
import { FormEvent, useRef } from "react";
import {useState} from "react"
import { NoteData, Tag } from "./App";
import {v4 as uuidV4} from "uuid"
import { useNavigate } from "react-router-dom";

 type NotFormProps={
    onSubmit:(data:NoteData) =>void
    onAddTag:(tag:Tag)=>void
    availableTags:Tag[]  
 } & Partial<NoteData>

export function NoteForm({onSubmit,onAddTag,availableTags, title="",
markdown="", tags=[]}:NotFormProps){
    const titleRef=useRef<HTMLInputElement>(null)
    const markdownRef =useRef<HTMLTextAreaElement>(null)
    const [selectTags,setSelectedTags]= useState<Tag[]>(tags)
  const navigate = useNavigate()

    function handSubmit(e:FormEvent){
    e.preventDefault()
   onSubmit({
    title:titleRef.current!.value,
    markdown:markdownRef.current!.value,
    tags:selectTags,
   })
   navigate("..")
}

    return (
        <Form onSubmit={handSubmit}>
      <Stack gap={4}>
       <Row>
        <Col>
          <Form.Group controlId="title">
       <Form.Label>Title</Form.Label>
       <Form.Control required ref={titleRef} defaultValue={title}/>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="tags">
       <Form.Label>Tags</Form.Label>
       <CreatableReactSelect 
       onCreateOption ={label=>{
        const newTag ={id:uuidV4(), label}
        onAddTag(newTag)
        setSelectedTags(prev=>[...prev,newTag])
       }}
       value={selectTags.map(tag=>{
        return {label:tag.label,value:tag.id}
       
       })} 
       options={availableTags.map(tag=>{
        return {label:tag.label,value:tag.id}
       })}

       onChange={tags=>{
        setSelectedTags(tags.map(tag=>{
            return {label:tag.label,id:tag.value}
        }))
    }}
       isMulti/>
          </Form.Group>
        </Col>
       </Row>
       <Form.Group controlId="markdown">
       <Form.Label>Body</Form.Label>
      <Form.Control required as="textarea" defaultValue={markdown}  rows={10} ref={markdownRef}/>
          </Form.Group>
          <Stack direction="horizontal" gap={2} className="justify-content-end">
            <Button type="submit" variant="primary">
                Save
            </Button>
            <Link to="..">
            <Button type="submit" variant="outline-secondary">
                Cancel
            </Button>
            </Link>
           
          </Stack>
      </Stack>
        </Form>
   
    )
}