import React, { Component } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Axios from "axios";
import { Link } from "react-router-dom";


export default class View extends Component {
  state= {
    title:'',
    content:''
  }


 
  detail = () =>{
    let url = window.location.href; //현재주소
    //console.log(url); // http://localhost:3000/view?id=1
    let urlParams = url.split('?')[1];
    //console.log(urlParams); //id=1
    const searchParams = new URLSearchParams(urlParams); //{id:1} 객체로
    console.log(urlParams);
    let id = searchParams.get('id'); //1

    Axios.get(`http://localhost:8000/detail?id=${id}`)
    .then((res) => {
      const {data} = res;  //destructuring 비구조할당으로 변경
      console.log(data);
      this.setState({
        title: data[0].BOARD_TITLE,
        content: data[0].BOARD_CONTENT
      })
    })
    .catch((e)=> {
      // 에러 핸들링
      console.log(e);
    });     
  }
  //this.prop.isModifyMode에 변동사항이 생기면 detail 함수 실행, componentDidUpdate 함수로 


  componentDidMount() {
      this.detail();
  }


  render() {
 
    return (      
      <div>
        <h2>{this.state.title}</h2>
        <h3>{this.state.content}</h3>
        <hr/>
        <Link to="/" className="btn btn-secondary">
          목록
        </Link>
      </div>


    )
  }
}