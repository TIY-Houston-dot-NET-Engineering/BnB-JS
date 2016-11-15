// 'using' statements
import "babel-polyfill"
import fetch from "isomorphic-fetch"
import React, {Component} from 'react'
import {render} from 'react-dom'
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router'

// const getMessage = async (id) => {
//     let response = await fetch(`/api/message/${id}`)
//     let data = await response.json()
    
//     console.log(data)
// }

// const app = () => {
//     getMessage(4);
// }

// app();

const log = (...a) => console.log(...a)

const get = (url) =>
    fetch(url, {credentials: 'same-origin'})
    .then(r => {
        if (r.status === 200) return r.json()

        throw 403
    })
    .catch(e => {
        if(e === 403) window.location.hash = "#login"
    })

const post = (url, data) => 
    fetch(url, { 
        method: 'POST',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .catch(e => log(e))
    .then(r => r.json())

const bnb = x =>
    <Link to={`/bnb/${x.id}`} className="bnb">
        <p>{x.name}</p>
    </Link>



const Menu = () => <div>
    <a href="#">Home</a>
</div>
class Home extends Component {
    constructor(p){
        super(p)
        this.state = {
            bnbs: []
        }
    }
    componentDidMount() {
        get(`/api/bnb`).then(bnbs => this.setState({bnbs}))
    }
    submit(e) {
        e.preventDefault();
        post('/api/bnb', { name: this.refs.name.value })
            .then(x => {
                const {bnbs} = this.state
                bnbs.push(x)
                this.setState({bnb})
            })
            .catch(e => log(e))
    }
    render(){
        return <div>
            <Menu />
            <hr/>
            <form onSubmit={e => this.submit(e)}>
                <div>
                    <label htmlFor="name">Name of new BnB</label>
                    <input ref="name" type="text" id="name" placeholder="Type a name of the new BnB" />
                </div>
                <button type="submit">Send</button>
            </form>
            <hr/>
            <div>
                {this.state.bnbs.map(bnb)}
            </div>
        </div>
    }
}

const message = m =>
    <li>{m.text} - <em>{m.visitor.name}</em></li>

class BnB extends Component {
    constructor(p){
        super(p)
        this.state = { bnb: {} }
    }
    componentDidMount() {
        get(`/api/bnb/${this.props.params.bnbId}`)
            .then(bnb => this.setState({bnb}))
    }
    submit(e){
        e.preventDefault()
        post('/api/message', { text: this.refs.message.value, bnbid: this.state.bnb.id, visitor: { name: 'matthiasak' } })
            .then(x => {
                const {bnb} = this.state
                bnb.messages.push(x)
                this.setState({bnb})
            })
            .catch(e => alert(e))
    }
    render(){
        const {bnb} = this.state
        return <div>
            <Menu />
            <hr />
            <h5>{bnb.name}</h5>
            <hr/>
            <form onSubmit={e => this.submit(e)}>
                <div>
                    <label htmlFor="message">Message</label>
                    <input ref="message" type="text" id="message" placeholder="Type a message to share" />
                </div>
                <button type="submit">Send</button>
            </form>
            <hr/>
            {bnb.messages && bnb.messages.map(message)}
        </div>
    }
}

class Login extends Component {
    constructor(p){
        super(p)
    }
    submit(e){
        e.preventDefault()
        post('/login', 
            {
                email: this.refs.email.value,
                password: this.refs.password.value
            })
            .then(x => {
                window.location.hash = "#"
            })
            .catch(e => log(e))
    }
    render(){
        return <div>
            <Menu />
            <hr/>
            <form onSubmit={e => this.submit(e)}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input ref="email" type="email" id="email" placeholder="Your email" />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input ref="password" type="password" id="password" placeholder="Your password" />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    }
}

const a404 = () => <h2> Page Not Found! U mad? </h2>

const reactApp = () => 
    render(
    <Router history={hashHistory}>
        <Route path="/" component={Home}/>
        <Route path="/bnb/:bnbId" component={BnB}/>
        <Route path="/login" component={Login}/>
        <Route path="*" component={a404}/>
    </Router>,
    document.querySelector('.app'))
reactApp()