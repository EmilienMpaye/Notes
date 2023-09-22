import { useState,useMemo } from "react"
import {Button,Col,Row,Form,Stack,Card,Badge,Modal} from "react-bootstrap"
import {Link} from "react-router-dom"
import ReactSelect from "react-select"
import { Note, Tag } from "./App"
import styles from "./NoteList.module.css"
type SimplifiedNote ={
    tags:Tag[]
    title:string
    id:string
}

type NoteListProps ={
availableTags:Tag[]
notes:Note[]
onDeleteTag:(id:string)=>void
onUpdateTag:(id:string,label:string)=>void
}

type ShowModalProps ={
    show:boolean
    availableTags:Tag[]
    handleClose:()=>void
    onDeleteTag:(id:string)=>void
onUpdateTag:(id:string,label:string)=>void
}

export function NoteList ({availableTags,notes,onUpdateTag,onDeleteTag}:NoteListProps){
    const [selectTags,setSelectedTags]= useState<Tag[]>([])
    const [title , setTitle] = useState<string>("")
    const [editTagModelIsOpen, setEditedTagModelOpen] =useState<boolean>(false);
//     const filteredNotes = useMemo(()=>{
//         return notes.filter(note=>{
//    return (title ===""||note.title.toLowerCase().includes(title.toLowerCase()))&&(selectTags.every(tag=>note.tags.same(note=>
//     note.id !==tag.id)))
//         })
//     },[title,selectTags,notes])

const filteredNotes = useMemo(() => {
    return notes.filter(note => {
        return (title === "" || note.title.toLowerCase().includes(title.toLowerCase())) &&
            selectTags.every(tag => !note.tags.some(noteTag => noteTag.id === tag.id));
    });
}, [title, selectTags, notes]);

    return <>
    <Row className="align-items-center mb-4Col">
        <Col>
      <h1> Notes</h1>
        </Col>
        <Col xs="auto">
            <Stack gap={2} direction="horizontal">
                <Link to ="/new">
                    <Button variant="primary">
                Create
                    </Button>
                </Link>
                <Button onClick={()=>setEditedTagModelOpen(true)} variant="outline-secondary">Edit Tag</Button>
            </Stack>
        </Col>
    </Row>
    <Form>
        <Row className="mb-4">
            <Col>
            <Form.Group controlId="title" >
                <Form.Label>
                  Title
                </Form.Label>
                <Form.Control type="text" value={title}
                onChange={e=>setTitle(e.target.value)}/>
            </Form.Group>
            </Col>
            <Col>
            <Form.Group controlId="tags">
       <Form.Label>Tags</Form.Label>
       <ReactSelect 
    //    onCreateOption ={label=>{
    //     const newTag ={id:uuidV4(), label}
    //     onAddTag(newTag)
    //     setSelectedTags(prev=>[...prev,newTag])
    //    }}
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
    </Form>
    <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
        {filteredNotes.map(note=>(
            <Col key={note.id}>
                <NoteCard id={note.id} title={note.title} tags={note.tags}/>
            </Col>
        ))}
    </Row>
    <EditTagsModal  onUpdateTag={onUpdateTag} onDeleteTag={onDeleteTag}
    show={editTagModelIsOpen} handleClose={()=>
        setEditedTagModelOpen(false)} availableTags={availableTags}/>
    </>
}


function NoteCard ({id,title,tags}:SimplifiedNote){
return <Card as={Link} to={`/${id}`} className={`
h-100 text-reset text-decoration-none ${styles.card}`}>
      <Card.Body>
        <Stack gap={2}  className="align-items-center 
        justify-content-center h-100" >
            <span className="fs-5">{title}</span>
           
           {tags.length > 0 && ( 
           <Stack gap={1} direction="horizontal" 
           className="justify-content-center flex-wrap" >
            { tags.map(tag=>( 
                <Badge className="text-truncate" key={tag.id} >
               {tag.label}
                </Badge>
            ))}


           </Stack>)}
        </Stack>
      </Card.Body>
</Card>
}


function EditTagsModal({availableTags,handleClose,
    show,onDeleteTag,onUpdateTag}:ShowModalProps) {
    return <Modal show={show} onHide={handleClose} >
        <Modal.Header closeButton>
        <Modal.Title >Edit</Modal.Title>
        </Modal.Header>
         <Modal.Body>
            <Form>
                <Stack gap={2}>
                    {availableTags.map(tag=>(
                        <Row key={tag.id}>
                            <Col>
                    <Form.Control type="text" value={tag.label}
                    onChange={e=>onUpdateTag(tag.id,e.target.value)} />
                            </Col>
                     <Col xs="auto" >
                        <Button variant="outline-danger" 
                        onClick={()=>onDeleteTag(tag.id)}>&times;</Button>
                     </Col>
                        </Row>
                    ))}
                </Stack>
            </Form>
         </Modal.Body>
    </Modal>
}





