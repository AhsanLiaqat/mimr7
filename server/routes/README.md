# Route structure

resource routes generally ought to conform to the following format

POST /objects/ to create an object

GET /objects/ to get all objects

GET /objects/{id}/ to get a specific object

PUT /objects/{id}/ to update a specific object

DELETE /objects/{id}/ to delete a specific object


nested resources can be used where they make logical sense, ie

POST /object1s/{object1id}/object2s/

GET /object1s/{object1id}/object2s/

GET /object2s/{object2id}/ to get a specific object

PUT /object2s/{object2id}/ to update a specific object

DELETE /object2s/{object2id}/ to delete a specific object

If a feature requires a route format that differs from the above, do not hesitate to use it.