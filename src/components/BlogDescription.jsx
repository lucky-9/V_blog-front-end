import React, { Component } from 'react';
import  MDSpinner  from 'react-md-spinner';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import { API } from './../backend';
import {likeIncrementer} from '../services/blog';
import { isAuthenticated } from './../services/auth';


const sizeOfLoader = 150;
const loaderColor = "#f4f4f4";

class BlogDescription extends Component {
    constructor(props){
        super(props)
        this.state={blog:''}
    }

    handleLike =async () =>{
        if(!isAuthenticated()){
           this.props.history.push('/signin') 
        }
        let blog = {};
        blog = {...this.state.blog};
        blog.likes = blog.likes+1;
        console.log("before setting state : ", blog)
        this.setState({blog});
        await likeIncrementer(blog._id);
    }

    async componentDidMount(){
        try{
            const blogApiCall = await fetch(`${API}/blog/${this.props.match.params.blogId}`)
            let blog = await blogApiCall.json()
            this.setState({blog})
            console.log(blog)
        }
        catch(ex){
            console.log(`error fetching blog by ID ${ex}`)
        }
    }

    render() {
        if(!this.state.blog){
            return(<div style={{textAlign:"center", marginTop:"30vh"}}>
              <MDSpinner size={sizeOfLoader} singleColor={loaderColor}/>
            </div>) 
          } 
        const {title, description, createdAt, author} = this.state.blog;
        console.log("the author ", author.username)
        return ( 
        <>
        <div className="blog-header-background mb-5">
            <h1 className="blog-heading">{title}</h1>
            <p className="blog-author-details">By {author.username} on {createdAt.substring(0,10)}</p>
            <button className="btn btn-dark" onClick={this.handleLike}><ThumbUpAltIcon fontSize="large"/>{this.state.blog.likes}</button>
        </div>
        <div className="container">
            <p className="blog-description blog-text flex-wrap">{description}</p>
        </div>
        </>
         );
    }
}
 
export default BlogDescription;