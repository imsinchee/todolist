const config = {
    apiKey: "AIzaSyBSOUBCNLrJULyPy9e-TQsOw0XkfxSfWAA",
    authDomain: "polar-storm-240813.firebaseapp.com",
    databaseURL: "https://polar-storm-240813.firebaseio.com",
    projectId: "polar-storm-240813",
    storageBucket: "polar-storm-240813.appspot.com",
    messagingSenderId: "572073336908",
    appId: "1:572073336908:web:bdb4731e8bfd390bed14e9",
    measurementId: "G-GP7JV0TLL0"
  };

firebase.initializeApp(config);
var db = firebase.database();
var projectList = []
var projectObject = []
var currentprojectLinks = []
var curentprojectname = ''
var read = 'ongoing'

function run(){
    deleteAllLi("projects")
    projectList = []
    projectObject = []
    if (read == 'ongoing'){
        document.getElementById("currentMode").innerHTML = "On Going Project"
    }
    else{
        document.getElementById("currentMode").innerHTML = "Set Aside Project"
    }
    
    var project = db.ref('TODO/'+read)
    // console.log(project)
    project.once('value', function(data){
        data.forEach(function(child){
            projectList.push(child.key)
            projectObject.push(child.val())
        })
    }).then(()=>{
        var i;
        for (i = 0; i < projectList.length; i++){
            addProjectToTemplate(projectList[i])
        }
    })
}


function addProjectToTemplate(projectName){
    var paraA = document.createElement("a")
    paraA.innerHTML = projectName
    paraA.addEventListener("click",()=>{
        showProjectDetails(projectName)
    })
    var button = document.createElement("button")
    button.innerHTML = "Move to bin"
    button.addEventListener("click",()=>{
        deleteProject(projectName)
    })
    var br = document.createElement("br")
    var element = document.getElementById("projects");
    element.appendChild(paraA);
    element.appendChild(button)
    element.appendChild(br)
}

function showProjectDetails(projectName){
    deleteAllLi("links")
    document.getElementById('projectName').innerHTML = projectName
    document.getElementById('addlink').style.visibility="visible"
    var p = (element) => element == projectName;
    curentprojectname = projectName
    var index = projectList.findIndex(p)
    document.getElementById('projectDescription').value = projectObject[index].description
    currentprojectLinks = projectObject[index].links
    for (var key in projectObject[index].links){
        console.log(key)
        console.log(projectObject[index].links[key])
        // <li><a href="#">Coffee</a></li>
        var li = document.createElement("LI")
        var a = document.createElement("a")
        a.innerHTML = key
        a.href = projectObject[index].links[key]
        li.appendChild(a)
        var element = document.getElementById("links");
        element.appendChild(li);
    }
}

function deleteAllLi(id){
    root = document.getElementById(id)
    while( root.firstChild ){
        root.removeChild( root.firstChild );
    }
}

function deleteProject(projectName){
    console.log("Delete "+ projectName)
    var p = (element) => element == projectName;
    var index = projectList.findIndex(p)
    if (read == 'ongoing'){
        var addpro = db.ref('TODO/setaside/'+projectName)
    }
    else{
        var addpro = db.ref('TODO/ongoing/'+projectName)
    }
    addpro.set(projectObject[index]).then(()=>{
        var delpro = db.ref('TODO/'+read+'/'+projectName)
        delpro.remove()
    }).then(()=>{
        run()
    })
}

function addDescription(){
    var des = document.getElementById("projectDescription").value
    var updateDes = db.ref('TODO/'+read+'/'+curentprojectname+'/description')
    updateDes.set(des)
}

function addLink(){
    var label = document.getElementById("projectLabel").value
    var link = document.getElementById("projectLink").value
    var addLink = db.ref('TODO/'+read+'/ongoing/'+curentprojectname+'/links/'+label)
    addLink.set(link).then(()=>{
        document.getElementById("projectLabel").value = ''
        document.getElementById("projectLink").value = ''
    })
}

function overwrite(mode){
    if (mode == 0){
        read = 'ongoing'
    }
    else{
        read = 'setaside'
    }
    document.getElementById("mySidenav").style.width = "0";
    run()
}

function addProject(){
    var label = document.getElementById("addProject").value
    var addpro = db.ref('TODO/'+read+'/'+label)
    addpro.set("wooo").then(()=>{
        document.getElementById("addProject").value = ''
        run()
    })
}
