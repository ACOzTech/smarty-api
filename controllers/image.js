getClarifaiRequestOptions = (imageURL) => {
  // Your PAT (Personal Access Token) can be found in the Clarifai portal
  const PAT = '730aa9e7383a4392be746176c2e4a129';
  const USER_ID = 'clarifai';       
  const APP_ID = 'main';      
  const IMAGE_URL = imageURL;
  
  const raw = JSON.stringify({
    "user_app_id": {
      "user_id": USER_ID,
      "app_id": APP_ID
    },
    "inputs": [
      {
        "data": {
          "image": {
            "url": IMAGE_URL
          }
        }
      }
    ]
  });

  const requestOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Key ' + PAT
    },
    body: raw
  };
  
  return requestOptions;
}

const handleAPICall = (req, res) => {
  const CLARIFAI_URL = 'https://api.clarifai.com/v2/models/';
  const MODEL_ID = 'face-detection';
  
  fetch(CLARIFAI_URL + MODEL_ID + '/outputs', getClarifaiRequestOptions(req.body.input))
    .then(response => response.json())
    .then(data => res.json(data))
    .catch(err => res.status(400).json('Unable to work with API'));
}

const handleImage =(req, res, db) => {
  const { id } = req.body;

  db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      return res.json(entries[0].entries);
    })
    .catch(err => res.status(404).json('Error getting entries'));
};

module.exports = {
  handleImage,
  handleAPICall
}