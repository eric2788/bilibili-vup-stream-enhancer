function log(msg){
    console.log(`[IndexedDB] ${msg}`)
}

let db = undefined
let collection = 'jimaku'

export async function connect(key){
    return new Promise((res, rej) => {
        const open = window.indexedDB.open(key, 4)
        log('connecting to indexedDB')
        open.onerror = function(event){
            log('connection error: '+event.target.error.message)
            rej(event.target.error)
        }
        open.onsuccess = function(event){
            db = open.result
            log('connection success')
            createObjectStoreIfNotExist(db, collection, rej)
            res(event)
        }
        open.onupgradeneeded = function(event) { 
            db = event.target.result;
            log('connection success on upgrade needed')
            createObjectStoreIfNotExist(db, collection, rej)
            res(event.target.error)
        }
    })
      
}

export function close(){
    db?.close()
}

export async function drop(key){
    return new Promise((res, rej) => {
        const req = window.indexedDB.deleteDatabase(key);
        req.onsuccess = function () {
            log("Deleted database successfully");
            res()
        };
        req.onerror = function () {
            log("Couldn't delete database");
            rej(req.error)
        };
        req.onblocked = function () {
            log("Couldn't delete database due to the operation being blocked");
            rej(req.error)
        };
    })
}

function createObjectStoreIfNotExist(db, key, rej){
    if(!db) return
    try{
        if (!db.objectStoreNames.contains(key)) {
            log(`objectStore ${key} does not exist, creating new one.`)
            const objectStore = db.createObjectStore(key, { autoIncrement: true })
            objectStore.createIndex('date','date', {unique: false})
            objectStore.createIndex('text', 'text', {unique: false})
            log('successfully created.')
        }
    }catch(err){
        log('error while creating object store: '+err.message)
        rej(err)
    }
    db.onerror = function(event) {
        log("Database error: " + event.target.error.message);
    }
    db.onclose = () => {
        console.log('Database connection closed');
    }
}


export async function pushRecord(object){
   return new Promise((res, rej)=>{
        if (!db){
            log('db not defined, so skipped')
            rej(new Error('db is not defined'))
        }
        try{
            const tran = db.transaction([collection], 'readwrite')
            handleTrans(rej, tran)
            const s = tran.objectStore(collection).add(object)
            s.onsuccess = (e) => {
                //log('pushing successful')
                res(e)
            }
            s.onerror = (e) => {
                log('error while adding record: '+s.error.message)
                rej(s.error)
            }
        }catch(err){
            rej(err)
        }
   })
 }

 function handleTrans(rej, tran){
    tran.oncomplete = function(event){
        //log('transaction completed')
    }
    tran.onerror = function(event){
        log('transaction error: '+tran.error.message)
        rej(tran.error)
    }
 }
 
 export async function listRecords(){
   return new Promise((res, rej) => {
    if (!db){
        log('db not defined, so skipped')
        rej(new Error('db is not defined'))
      }
      try{
        const tran = db.transaction([collection], 'readwrite')
        handleTrans(rej, tran)
        const cursors = tran.objectStore(collection).openCursor()
        const records = []
        cursors.onsuccess = function(event){
           let cursor = event.target.result;
           if (cursor) {
              records.push(cursor.value)
              cursor.continue();
           }
           else {
             log("total records: "+records.length);
             res(records)
           }
        }
        cursors.onerror = function(event){
            log('error while fetching data: '+cursors.error.message)
            rej(cursors.error)
        }
      }catch(err){
          rej(err)
      }
   })
 }
 
 export async function clearRecords(){
   return new Promise((res, rej) => {
        if (!db){
            log('db not defined, so skipped')
            rej(new Error('db is not defined'))
        }
       try{
            const tran = db.transaction([collection], 'readwrite')
            handleTrans(rej, tran)
            const req = tran.objectStore(collection).clear()
            req.onsuccess = (e) => {
            log('clear success')
            res(e)
            }
            req.onerror = (e) =>{
                log('error while clearing data: '+req.error.message)
                rej(req.error)
            }
       }catch(err){
           rej(err)
       }
   })
}