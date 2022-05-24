import React, { Component, useEffect } from 'react'

class TagDisplay extends Component {



  constructor(props) {
    super(props);
  }
  componentDidMount() {
    console.log(this.props, "ddd")
  }
  render() {
    return (
      <div>
        {
          Array.isArray(this.props.value)?
          this.props.suggestions.filter(i => this.props.value?.includes(i.id)).map((tag, index) => <span className="text-white f-15 theme-bg2 badge mr-1" key={index}>{tag.name}</span>)
          :
          null
        }
      </div>
    )
  }
}

export default TagDisplay;