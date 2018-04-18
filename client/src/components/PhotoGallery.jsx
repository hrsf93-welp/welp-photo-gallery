import React from 'react';
import $ from 'jquery';
import Photo from './Photo.jsx';
import Modal from './Modal.jsx';

const queryString = require('query-string');

export default class PhotoGallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      currentPhotos:[],
      showModal: false,
      selectedPhoto:[],
    };
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.previousPhoto = this.previousPhoto.bind(this);
    this.nextPhoto = this.nextPhoto.bind(this);
  }

  componentDidMount() {
    const parsed = queryString.parse(location.search);
    this.getPhotos(Number(parsed.id));
  }

  getPhotos(id) {
    $.ajax({
      type: 'GET',
      url: `/api/photo/${id}`,
      dataType: 'json', 
      contentType: 'application/json',
      success: (results) => {
        const restaurantPhotos = []
        for (let i = 0; i < results.length; i++) {
          restaurantPhotos.push(results[i]);
        }
        const firstThreePhotos = restaurantPhotos.slice(0,3);
        this.setState({
          photos: restaurantPhotos,
          currentPhotos: firstThreePhotos,
        });
      },
      error: (error) => {
        console.log('get request error')
      }
    })
  };

  handleOpen(photo) {
    console.log(photo)
    this.setState({
      showModal: true,
      selectedPhoto: photo,
    });
  }

  handleClose() {
    this.setState({
      showModal: false,
      selectedPhoto: [],
    });
  }

  previousPhoto(photo) {
    let previousOne;
    const index = this.state.photos.indexOf(photo);
    if (index === 0) {
      previousOne = this.state.photos[this.state.photos.length - 1];
    } else {
      previousOne = this.state.photos[index - 1];
    }
    this.setState({
      selectedPhoto: previousOne,
    },()=> {
      console.log(this.state.selectedPhoto)
    });
  }

  nextPhoto(photo) {
    let nextOne;
    const index = this.state.photos.indexOf(photo);
    if (index === (this.state.photos.length - 1)) {
      nextOne = this.state.photos[0];
    } else {
      nextOne = this.state.photos[index + 1];
    }
    this.setState({
      selectedPhoto: nextOne,
    });
  }

  render() {
    return (
      <div className="intro">
        I am a photo gallery
        <a className="prev"></a>
        {this.state.currentPhotos.map((photo)=> <Photo photo = {photo} handleOpen = {this.handleOpen}/>)}
        <a className="next"></a>
        {this.state.showModal && (
          <Modal
            selectedPhoto={this.state.selectedPhoto}
            handleClose={this.handleClose}
            previousPhoto={this.previousPhoto}
            nextPhoto={this.nextPhoto}
          />
        )}
      </div>
    );
  }
}
