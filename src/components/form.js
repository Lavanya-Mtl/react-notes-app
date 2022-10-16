import {useState} from 'react';

function Form(props) {
    const [title,setTitle] = useState('');
    const [content,setContent] = useState('');
    function handleTitleChange(e) {
        //console.log(e.target.value);
        setTitle(e.target.value);
    }
    function handleContentChange(e) {
        //console.log(e.target.value);
        setContent(e.target.value);
    }
    function handleSubmit(e) {
        e.preventDefault();
        if(title!==''&&content!=='')
        {props.saveNote(title,content);}
        else{return;}
        //e.target.elements[0].value='';
        //e.target.elements[1].value='';
        e.target.reset();
        setTitle('');
        setContent('');
    }
    return(
        <form className='newNote' onSubmit={handleSubmit}>
            <div className='input-group'>
                <label htmlFor='noteTitle'>Title</label>
                <input onChange={handleTitleChange} type='text' id='noteTitle'/>
            </div>
            <div className='input-group'>
                <label htmlFor='noteContent'>Content</label>
                <input type='text' onChange={handleContentChange} id='noteContent'/>
            </div>
            <button type='submit'>Save</button>
        </form>
    );
}
export default Form;