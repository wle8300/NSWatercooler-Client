import NestedListHeader from './NestedListHeader'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Moment from 'moment'
import Uuid from 'uuid/v4'
import MUIList from 'material-ui/List/List'
import MUIListItem from 'material-ui/List/ListItem'
import MUIChip from 'material-ui/Chip'
import MUIAvatar from 'material-ui/Avatar'
import MUIOutfitCharactersCountIcon from 'material-ui/svg-icons/action/assignment-ind'
import MUIAverageBRIcon from 'material-ui/svg-icons/social/poll'


class OutfitStatsDropdown extends Component {
  constructor(props) {

    super(props)

    this.state = {
      isExpanded: false
    }
  }
  render() {

    const sortCharactersByRank = (characters) => {
      return characters.sort((characterA, characterB) => {
        if (characterA.rank_ordinal > characterB.rank_ordinal) return 1
        if (characterA.rank_ordinal < characterB.rank_ordinal) return -1
        else return 0
      })
    }


    const calcPercentageOutfitParticipation = (timeframe) => {

      const calcDataset = this.props.outfitLogins.filter((login) => new Date(login.time) > new Date(Moment().subtract(1, timeframe)))
      const uniqueCount = calcDataset
      .map((login) => login._Character_)
      .filter((_Character_, idx, array) => array.indexOf(_Character_) === idx).length

      return parseInt(100 *  uniqueCount / this.props.outfitCharacters.length, 10)+ '%'
    }

    const calculateAvgBR = (outfitCharacters) => {

      const total = outfitCharacters.reduce((sum, character) => sum + parseInt(character.character.battle_rank.value, 10), 0)
      const length = outfitCharacters.length

      return parseInt(total/length, 10)
    }

    const sortedByRank = sortCharactersByRank(this.props.outfitCharacters)
    const outfitLeaders = sortedByRank.filter((character) => character.rank === 'Leader')
    const outfitOfficers = sortedByRank.filter((character) => character.rank === 'Officer')
    const outfitMembers = sortedByRank.filter((character) => character.rank === 'Member')
    const outfitPrivates = sortedByRank.filter((character) => character.rank === 'Private')


    return (
      <div style={{
        zIndex: 1,
        position: this.props.isExpanded ? 'relative' : 'absolute',
        margin: '1rem',
        padding: '1rem',
        maxHeight: this.props.isExpanded ? '100%' : 0,
        transition: 'position 250ms linear, max-height 250ms linear, transform 250ms linear',
        overflow: 'hidden',
        backgroundColor: '#f3f3f3',
        borderRadius: 4,
        transform: this.props.isExpanded ? 'scale(1)' : 'scale(0)'
      }}>
        <MUIOutfitCharactersCountIcon/> {this.props.memberCount ? this.props.memberCount+ ' Members' : 'Crunching...'}
        <MUIAverageBRIcon/> {this.props.outfitCharacters.length ? calculateAvgBR(this.props.outfitCharacters)+ ' Average BattleRank' : 'Crunching...'}
        <NestedListHeader>Established</NestedListHeader> <div>{this.props.establishDate ? Moment(this.props.establishDate).fromNow() : 'Loading...'}</div>
        <NestedListHeader>Composition</NestedListHeader>
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          <MUIChip style={{margin: '0.25rem'}}><MUIAvatar>{outfitLeaders.length}</MUIAvatar>Leaders</MUIChip>
          <MUIChip style={{margin: '0.25rem'}}><MUIAvatar>{outfitOfficers.length}</MUIAvatar>Officers</MUIChip>
          <MUIChip style={{margin: '0.25rem'}}><MUIAvatar>{outfitMembers.length}</MUIAvatar>Members</MUIChip>
          <MUIChip style={{margin: '0.25rem'}}><MUIAvatar>{outfitPrivates.length}</MUIAvatar>Privates</MUIChip>
        </div>
        <NestedListHeader>Login Activity</NestedListHeader>
        <MUIList>
          <MUIListItem
            primaryText="Past Month"
            rightAvatar={<MUIAvatar>{calcPercentageOutfitParticipation('month')}</MUIAvatar>}
          disabled/>
          <MUIListItem
            primaryText="Week"
            rightAvatar={<MUIAvatar>{calcPercentageOutfitParticipation('week')}</MUIAvatar>}
          disabled/>
          <MUIListItem
            primaryText="Day"
            rightAvatar={<MUIAvatar>{calcPercentageOutfitParticipation('day')}</MUIAvatar>}
          disabled/>
        </MUIList>
        <div
          onTouchTap={this.props.closeHandler}
          style={{
            position: 'relative',
            left: '-1rem',
            top: '1rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1rem',
            width: '100%',
            backgroundColor: 'lightgray',
          }}
        >
          CLOSE
        </div>
      </div>
    )
  }
}


OutfitStatsDropdown.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
  memberCount: PropTypes.number,
  outfitCharacters: PropTypes.array,
  establishDate: PropTypes.string,
  outfitLogins: PropTypes.array,
}

OutfitStatsDropdown.defaultProps = {
  isExpanded: false,
  memberCount: 0,
  outfitCharacters: [],
  establishDate: null,
  outfitLogins: [],
}

export default OutfitStatsDropdown