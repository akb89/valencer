<a name="opt"></a>

## Projection/Population

#### Projecting one field
Projecting the `sentence`field of an `AnnotationSet` document:
```
curl -i "http://localhost:3030/v5/en/170/annoSet/2614616/sentence"
curl -i "http://localhost:3030/v5/en/170/annoSets/sentence?vp=Donor.NP.Ext+Theme.NP.Obj"
```

#### Projecting multiple fields
To project multiple fields, separate projected fields by a `,`:
```
curl -i "http://localhost:3030/v5/en/170/annoSet/2614616/sentence,lexUnit"
curl -i "http://localhost:3030/v5/en/170/annoSets/sentence,lexUnit?vp=Donor.NP.Ext+Theme.NP.Obj"
```

#### Populating a projected field
Populating the `sentence` field of an `AnnotationSet` document:
```
curl -i "http://localhost:3030/v5/en/170/annoSet/2614616/sentence/sentence"
curl -i "http://localhost:3030/v5/en/170/annoSets/sentence/sentence?vp=Donor.NP.Ext+Theme.NP.Obj"
```

#### Populating projected fields
To populate multiple projected fields, separate populated and projected fields by a `,`:
```
curl -i "http://localhost:3030/v5/en/170/annoSet/2614616/sentence,lexUnit/sentence,lexUnit"
curl -i "http://localhost:3030/v5/en/170/annoSets/sentence,lexUnit/sentence,lexUnit?vp=Donor.NP.Ext+Theme.NP.Obj"
```

#### Populating without projecting
To populate a given field (e.g. `sentence`) without projecting any field, leave the `projection` field with a `,`:
```
curl -i "http://localhost:3030/v5/en/170/annoSet/2614616/,/sentence"
curl -i "http://localhost:3030/v5/en/170/annoSets/,/sentence?vp=Donor.NP.Ext+Theme.NP.Obj"
```

#### Populating nested fields
Populating the `lexUnit.frame` field of an `AnnotationSet` document:
```
curl -i "http://localhost:3030/v5/en/170/annoSet/2614616/,/lexUnit.frame"
curl -i "http://localhost:3030/v5/en/170/annoSets/,/lexUnit.frame?vp=Donor.NP.Ext+Theme.NP.Obj"
```

## Help
Suggestions, contact, support and error reporting on [GitHub](https://github.com/akb89/valencer)
