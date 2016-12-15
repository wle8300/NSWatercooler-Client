import React from 'react'
import Request from 'superagent'
import MUIPaper from 'material-ui/Paper'
// import MUIDivider from 'material-ui/Divider'
import MUIDialog from 'material-ui/Dialog'
import MUIArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right'
import MUIFlatButton from 'material-ui/FlatButton';
import MUIList from 'material-ui/List/List'
import MUIListItem from 'material-ui/List/ListItem'
import MUITextField from 'material-ui/TextField'
import MUIRaisedButton from 'material-ui/RaisedButton'
import MUISubheader from 'material-ui/Subheader'


module.exports = React.createClass({
	propTypes: {
		_Outfit_: React.PropTypes.string,
		routerRef: React.PropTypes.oneOfType([React.PropTypes.element, React.PropTypes.any]),
		changeMarquee: React.PropTypes.func.isRequired
	},
	getInitialState: function () {
		return {
			outfitsSearchTerm: '',
			outfitsSearchResults: [],
			isModalOpen: false
		}
	},
  render: function () {

    return (
			<div>
				<this.Modal/>
				<div className="Outfit-Search-Form" style={{margin: '1rem'}}>
					<MUIPaper style={{padding: '0 1rem'}}>
						<MUITextField
							value={this.state.outfitsSearchTerm}
							onChange={(e) => this.setState({outfitsSearchTerm: e.target.value})}
							hintText="Lowercase minimum 3 characters"
							fullWidth
							underlineShow={false}/>
						<MUIRaisedButton
							label="Search"
							disabled={this.state.outfitsSearchTerm.length < 3 ? true : false}
							onTouchTap={this.submitOutfitSearch}
							secondary
							fullWidth/>
						{
							this.state.outfitsSearchResults
							? (<MUIList>
									{this.state.outfitsSearchResults.map((outfit) => {
										return (
											<MUIListItem
											  key={outfit.outfit_id}
											  primaryText={outfit.alias}
											  rightIcon={<MUIArrowRight/>}
												onTouchTap={this.handleOpenModal.bind(this, outfit.outfit_id)}/>
										)
									})}
								</MUIList>)
							: null					
						}
					</MUIPaper>
					{
						<MUIPaper style={{padding: '0 1rem'}}>
							{
								this.state.outfitsSearchResults.length
								? (<MUIList>
										{this.state.outfitsSearchResults.map((outfit) => {
											return (
												<MUIListItem
												  key={outfit.outfit_id}
												  primaryText={outfit.alias}
												  rightIcon={<MUIArrowRight/>}
													onTouchTap={() => console.log(1)}/>
											)
										})}
									</MUIList>)
								: null					
							}
						</MUIPaper>
					}
				</div>
			</div>
    )
  },
	componentWillMount: function () {
		
		this.props.changeMarquee('Outfit')
	},
	Modal: function () {
		
		const actions = [
      <MUIFlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleCloseModal}
      />,
      <MUIFlatButton
        label="Submit"
        primary={true}
        onTouchTap={this.handleCloseModal}
      />,
    ];
		
		return (
			<MUIDialog title="AYYY"
	      actions={actions}
	      open={this.state.isModalOpen}
	      onRequestClose={this.handleCloseModal}
				autoScrollBodyContent={true}
				overlayStyle={{
					backgroundColor: 'transparent'
				}}
				contentStyle={{
					position: 'fixed',
					top: '0',
					width: '100%',
					maxWidth: 'none',
					// height: '100%',
					padding: 0,
					// transform: 'none'
				}}>

				asdf!

			</MUIDialog>
		)
	},
	handleOpenModal: function () {

		this.setState({isModalOpen: true})
	},
	handleCloseModal: function () {

		this.setState({isModalOpen: false})
	},
	submitOutfitSearch: function (e) {
		
		e.preventDefault()

		Request
		.get('http://localhost:3001/outfit?search=' +this.state.outfitsSearchTerm+ '&server=genudine')
		.end((err, response) => {
			this.setState({outfitsSearchResults: response.body})
		})
	}
})