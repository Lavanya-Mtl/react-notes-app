//import Note from './components/note';
import Form from './components/form';
import {nanoid} from 'nanoid';
import {useState} from 'react';
import NoteList from './components/note';

function getDateandTime() {
    const date = new Date();
    let d,month,min,hr,s;
    if (date.getDate()<10) {
      d='0'+date.getDate();
    } else {d=date.getDate();}
    if (date.getMonth()<10) {
      month='0'+date.getMonth();
    }else {month=date.getMonth();}
    if (date.getMinutes()<10) {
      min='0'+date.getMinutes();
    }else {min=date.getMinutes();}
    if (date.getHours()<10) {
      hr='0'+date.getHours();
    }else {hr=date.getHours();}
    if (date.getSeconds()<10) {
      s='0'+date.getSeconds();
    }else{s=date.getSeconds();}
    return hr+':'+min+':'+s+' on '+d+'/'+month+'/'+date.getFullYear();
}
const notes = [
  {id: 'note-1', title: 'First note', content:'This is the first note', isSelected:false, lastModified: getDateandTime(),isArchived:false},
  {id: 'note-2', title: 'Second note', content:'This is the second note', isSelected:false, lastModified: getDateandTime(),isArchived:false},
];
let backup = [];

function App() {
  const [Notes, setNotes]=useState(notes)
  const [Searched,setSearched] = useState([]);
  const [showMode,setShowMode] = useState('current');

  function saveNote(title,content) {
    const newNote= {
      id:`note-${nanoid()}`,
      title,content,
      isSelected:false,
      lastModified:getDateandTime(),
      isArchived:false
    }
    setNotes([...Notes,newNote]);
  }

  function toggleSelect(id) {
    const selection = Notes.map((note)=>{
      if(id===note.id) {
        return {...note,isSelected:!note.isSelected}
      }
      return note;
    });
    setNotes(selection);
  }

  function DeleteSelected() {
    let CurrentNotes=[];
    for (let note of Notes) {
      if (note.isSelected===false) {
        CurrentNotes.push(note);
      }
      else {
        note.isSelected=false;
        note.isArchived=false;
        backup.push(note);
      }
    }
    setNotes(CurrentNotes);
  }

  function deleteNote(id) {
    let CurrentNotes=[];
    for (let note of Notes) {
      if (id!==note.id) {
        CurrentNotes.push(note);
      }
      else {
        note.isSelected=false;
        note.isArchived=false;
        backup.push(note);
      }
    }
    setNotes(CurrentNotes);
  }

  function BackUp() {
    setNotes([...Notes,...backup]);
    backup=[];
  }

  function archiveNotes() {
    const CurrentNotes=Notes.map((note)=>{
      if(note.isSelected===true) {
        note.isArchived=true;
        note.isSelected=false;
        return note;
      }
      return note;
    });
    setNotes(CurrentNotes);
  }

  function Archive(id) {
    const CurrentNotes=Notes.map((note)=>{
      if(note.id===id) {
        note.isArchived=!note.isArchived;
        //alert(note.isArchived);
        return note;
      }
      return note;
    });
    setNotes(CurrentNotes);
  }
  
  function editNote(id,title,content) {
    const editedNotes = Notes.map((note)=>{
      if(id===note.id) {
        return {...note,title:title,content:content,lastModified:getDateandTime()}
      }
      return note;
    });
    setNotes(editedNotes);
  }

  function SearchNotes(e) {
    if(e.target.value===''){
      setSearched([]);
      return;
    }
    const filteredNotes = Notes.filter( note => {
        return (
          note.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
          note.content.toLowerCase().includes(e.target.value.toLowerCase())
        );
    });
    setSearched(filteredNotes);
  }


  return (
    
   <div className='application'>
    <div>
    <h1>Notes application</h1>
    <div className='SearchDiv'>
      <div className='input-group'>
      <label htmlFor='searchInput'>Search Notes </label>
      <input id='searchInput' onChange={SearchNotes} type='text'/>
      </div>
    </div>
    <div className='notesBox'>
    <NoteList Notes={Searched} toggleSelect={toggleSelect} delete={deleteNote} edit={editNote} showMode={'current'} archive={Archive}/>
    </div>

    </div>
    <div className='NoteCreator'>
    <h2>Create New Note</h2>
    <Form saveNote={saveNote}/>
   </div>
    <div>
      <h2>Notes</h2>
      {
        Notes.length>0 ?
      (<div className="btn-group">
        
        <button onClick={archiveNotes}>Archive</button>
        <button onClick={BackUp}>Backup</button>
        <button onClick={DeleteSelected}>Delete</button>
        <button onClick={()=>{setShowMode('all');}}>Show All</button>
        <button onClick={()=>{setShowMode('archives');}}>Show Archives</button>
        <button onClick={()=>{setShowMode('current');}}>Show Active</button>
      </div>):''
      }
      <div className='notesBox'>
        <NoteList Notes={Notes} toggleSelect={toggleSelect} delete={deleteNote} edit={editNote} archive={Archive} showMode={showMode}/>
      </div>
    </div>
    
   </div>
   
  );
}

export default App;
