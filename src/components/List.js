import React from 'react'
import ListItem from './ListItem'

export default class List extends React.Component {
    constructor(props) {
        super(props);
        this.listRef = React.createRef()
        this.deliveryTextDict = {
            delivery: 'доставка',
            pickup: 'забор'
        }
        this.state = {
            first: 0,
            last: 0,
            scrollTop: 0,
            itemHeight: 60,
        }
        this.handleScroll = this.handleScroll.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }
   
    handleResize(){
        this.handleScroll()
    }
    handleScroll(){
        const scrollTop = this.listRef.current.scrollTop
        const first = Math.floor(scrollTop / this.state.itemHeight)
        const last = first + Math.ceil(parseInt(this.listRef.current.clientHeight, 10) / this.state.itemHeight)
        this.setState({
            scrollTop,
            first,
            last
        })
    }
    componentDidMount(){
        window.addEventListener('resize', this.handleResize);
        this.listRef.current.addEventListener('scroll', this.handleScroll,{
            capture: false,
            passive: true,
        });
        this.handleScroll()

    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
        this.listRef.current.removeEventListener('scroll', this.handleScroll);
    }
    render(){
        const slicedElements = this.props.apps.slice(this.state.first,this.state.last)
        return (
            <div className="List" ref={this.listRef} style={{
                position: 'relative',
            }}>
                <div className="List--container" style={{
                    height: this.props.apps.length * this.state.itemHeight,
                    
                }}>
                    { slicedElements.map((item) => {
                        return <ListItem 
                                    key={item.id}
                                    index={item.index}
                                    name={this.props.clientsIdMapping[item.client_id]}
                                    type={this.deliveryTextDict[item.type]}
                                    price={item.price}
                                    height={this.state.itemHeight}
                                    
                                />
                    })}
                </div>            
            </div>        
        )
    }
}