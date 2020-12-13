import rocksdb from 'rocksdb'

let db = rocksdb('pluralsight.db')

db.open(()=>{
    db.put('test', 'abs', (err) => {
        if (err) console.error(err);

        db.get('test', (err, value)=> {
            if (err) console.error(err);

            console.log('data:' + value)
            db.del('test', (err)=> {
                if (err) console.error(err);
                db.get('test', (err: Error | undefined, value: rocksdb.Bytes)=> {
                    if (err) {
                        console.error(err);
                    }
                    console.log('data:' + value)
                })
            })
        })
    })
    db.close(function (err) {
        // This happens second
      })
})
