import * as React from 'react'

export class ReactClass extends React.Component<{ readonly name: string }> {
  handleOnClick = () => {
    // left empty
  }

  render() {
    const { props } = this

    return <button name={props.name} aria-label="label" onClick={this.handleOnClick} type="button" />
  }
}
