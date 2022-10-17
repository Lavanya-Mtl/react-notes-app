//import Note from './components/note';
import Form from './components/form';
import {nanoid} from 'nanoid';
import {useState} from 'react';
import NoteList from './components/note';

//Returns current date and time in the required string format
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
//dummy data
const notes = [
  {id: `note-${nanoid()}`, title: 'First note', content:'This is the first note', isSelected:false, lastModified: getDateandTime(),isArchived:false},
  {id: `note-${nanoid()}`, title: 'Second note', content:'This is the second note', isSelected:false, lastModified: getDateandTime(),isArchived:false},
];
//deleted notes are preserved in backup array. in local storage it is stored in the key 'backup'
let backup = [];


function App() {
  //initializing from local storage
  const readSessionNotes = JSON.parse(window.localStorage.getItem('storedNotes'));
  let initializer;
  if (readSessionNotes!==null) {
    initializer=readSessionNotes;
  } else {
    initializer=[JSON.stringify(notes[0]),JSON.stringify(notes[1])]
    window.localStorage.setItem('storedNotes',JSON.stringify(initializer));
  }
  backup = JSON.parse(window.localStorage.getItem('backup'))
  if (backup===null) {backup=[]}
  const [Notes, setNotes]=useState(initializer);
  const [showMode,setShowMode] = useState('current');
  const [searchString,setSearchString] = useState('');
  
  //save the note when submit button is clicked
  function saveNote(title,content) {
    const newNote= {
      id:`note-${nanoid()}`,
      title,content,
      isSelected:false,
      lastModified:getDateandTime(),
      isArchived:false
    }
    const addedNote=[...Notes,JSON.stringify(newNote)];
    setNotes(addedNote);
    window.localStorage.setItem('storedNotes',JSON.stringify(addedNote));
  }
  //when checkbox is clicked, make it reflect in Notes and localStorage
  function toggleSelect(id) {
    const selection = Notes.map((note)=>{
      let n=JSON.parse(note);
      if(id===n.id) {
        return JSON.stringify({...n,isSelected:!n.isSelected});
      }
      return note;
    });
    setNotes(selection);
    window.localStorage.setItem('storedNotes',JSON.stringify(selection));
  }
  //delete all selected notes
  function DeleteSelected() {
    let CurrentNotes=[];
    for (let note of Notes) {
      let n=JSON.parse(note);
      if (n.isSelected===false) {
        CurrentNotes.push(note);
      }
      else {
        n.isSelected=false;
        n.isArchived=false;
        backup.push(JSON.stringify(n));
      }
    }
    setNotes(CurrentNotes);
    window.localStorage.setItem('storedNotes',JSON.stringify(CurrentNotes));
    window.localStorage.setItem('backup',JSON.stringify(backup));
  }
  //delete the particular note whose delete button is clicked. Explicitly unarchives notes if deleted note was an archived one
  function deleteNote(id) {
    let CurrentNotes=[];
    for (let note of Notes) {
      let n=JSON.parse(note);
      if (id!==n.id) {
        CurrentNotes.push(note);
      }
      else {
        n.isSelected=false;
        n.isArchived=false;
        backup.push(JSON.stringify(n));
      }
    }
    setNotes(CurrentNotes);
    window.localStorage.setItem('storedNotes',JSON.stringify(CurrentNotes));
    window.localStorage.setItem('backup',JSON.stringify(backup));
  }
  //retrive all deleted notes. 
  function BackUp() {
    const allNotes=[...Notes,...backup];
    setNotes(allNotes);
    backup=[];
    window.localStorage.setItem('storedNotes',JSON.stringify(allNotes));
    window.localStorage.setItem('backup',JSON.stringify(backup));
  }
  //archive all selected notes
  function archiveNotes() {
    const CurrentNotes=Notes.map((note)=>{
      let n=JSON.parse(note);
      if(n.isSelected===true) {
        n.isArchived=true;
        n.isSelected=false;
        return JSON.stringify(n);
      }
      return note;
    });
    setNotes(CurrentNotes);
    window.localStorage.setItem('storedNotes',JSON.stringify(CurrentNotes));
  }
  //archive the particular note whose archive button is clicked.
  function Archive(id) {
    const CurrentNotes=Notes.map((note)=>{
      let n=JSON.parse(note);
      if(n.id===id) {
        n.isArchived=!n.isArchived;
        n.isSelected=false;
        //alert(note.isArchived);
        return JSON.stringify(n);
      }
      return note;
    });
    setNotes(CurrentNotes);
    window.localStorage.setItem('storedNotes',JSON.stringify(CurrentNotes));
  }
  //edit the particular note when save button is clicked in editing mode
  function editNote(id,title,content) {
    const editedNotes = Notes.map((note)=>{
      let n=JSON.parse(note);
      if(id===n.id) {
        return JSON.stringify({...n,title:title,content:content,lastModified:getDateandTime()});
      }
      return note;
    });
    setNotes(editedNotes);
    window.localStorage.setItem('storedNotes',JSON.stringify(editedNotes));
  }

  function SearchNotes(e) {
    setSearchString(e.target.value);
  }

  return (
    
   <div className='application'>
    <div>
    <h1>Notes application</h1>
    
    

    </div>
    <div className='NoteCreator'>
    <h2>Create New Note</h2>
    <Form saveNote={saveNote}/>
   </div>
   <h2>Notes</h2>
   <div className='SearchDiv'>
      <div className='input-group'>
        <label htmlFor='searchInput'>Search Notes </label>
        <input id='searchInput' onChange={SearchNotes} type='text'/>
      </div>
    </div>
    <div>
     
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
      <h3>- - Showing {showMode} - -</h3>
      <div className='notesBox'>
        <NoteList Notes={Notes} toggleSelect={toggleSelect} delete={deleteNote} edit={editNote} archive={Archive} showMode={showMode} searchString={searchString}/>
      </div>
    </div>
    
   </div>
   
  );
}

export default App;
