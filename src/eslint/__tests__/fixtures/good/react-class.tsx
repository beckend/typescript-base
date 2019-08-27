import * as React from 'react'

export class ReactClass extends React.Component<{ readonly name: string }> {
  public handleOnClick = () => {
    // left empty
  }

  public render() {
    const { props } = this

    return <button name={props.name} onClick={this.handleOnClick} type="button" />
  }
}
