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
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        margin: '1rem',
        height: this.props.isExpanded ? '100%' : 0,
        maxHeight: '100%',
        opacity: this.props.isExpanded ? 0.8 : 0.1,
        overflow: 'hidden',
        backgroundColor: this.props.factionColors.standard,
        color: 'white',
        borderRadius: 4,
        transition: 'height 350ms ease-in-out, opacity 250ms ease-in',
      }}>

        {/* STUFFF */}
        <div style={{
          padding: '1.25rem',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
          }}>
            <MUIOutfitCharactersCountIcon
              color="white"
              style={{
                marginRight: '0.25rem',
                width: '1.8rem',
                opacity: 0.65,
              }}/>
            {this.props.memberCount ? this.props.memberCount+ ' Members' : 'Crunching...'}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
          }}>
            <MUIAverageBRIcon
              color="white"
              style={{
                marginRight: '0.25rem',
                width: '1.8rem',
                opacity: 0.65,
              }}/>
            {this.props.outfitCharacters.length ? calculateAvgBR(this.props.outfitCharacters)+ ' Average BattleRank' : 'Crunching...'}
          </div>
          <NestedListHeader>Established</NestedListHeader>
          <div>
            {this.props.establishDate ? Moment(this.props.establishDate).fromNow() : 'Loading...'}
          </div>
          <NestedListHeader>Composition</NestedListHeader>
          <div>
            <div>
              <MUIChip style={{display: 'inline-block', margin: '0.25rem', fontWeight: 'bolder', backgroundColor: this.props.factionColors.lighter}}><MUIAvatar backgroundColor={this.props.factionColors.light}>{outfitLeaders.length}</MUIAvatar>Leaders</MUIChip>
              <MUIChip style={{display: 'inline-block', margin: '0.25rem', fontWeight: 'bolder', backgroundColor: this.props.factionColors.lighter}}><MUIAvatar backgroundColor={this.props.factionColors.light}>{outfitOfficers.length}</MUIAvatar>Officers</MUIChip>
            </div>
            <div>
              <MUIChip style={{display: 'inline-block', margin: '0.25rem', fontWeight: 'bolder', backgroundColor: this.props.factionColors.lighter}}><MUIAvatar backgroundColor={this.props.factionColors.light}>{outfitMembers.length}</MUIAvatar>Members</MUIChip>
              <MUIChip style={{display: 'inline-block', margin: '0.25rem', fontWeight: 'bolder', backgroundColor: this.props.factionColors.lighter}}><MUIAvatar backgroundColor={this.props.factionColors.light}>{outfitPrivates.length}</MUIAvatar>Privates</MUIChip>
            </div>
          </div>
          <NestedListHeader>Login Activity</NestedListHeader>
          <div>
            <div style={{
              display: 'flex',
              margin: '0 0 0.25rem',
              color: 'white',
            }}>
              Past Month
              <span style={{marginLeft: '0.25rem', opacity: 0.65}}>{calcPercentageOutfitParticipation('month')}</span>
            </div>
            <div style={{
              display: 'flex',
              margin: '0 0 0.25rem',
              color: 'white',
            }}>
              Week
              <span style={{marginLeft: '0.25rem', opacity: 0.65}}>{calcPercentageOutfitParticipation('week')}</span>
            </div>
            <div style={{
              display: 'flex',
              margin: '0 0 0.25rem',
              color: 'white',
            }}>
              Day
              <span style={{marginLeft: '0.25rem', opacity: 0.65}}>{calcPercentageOutfitParticipation('day')}</span>
            </div>
          </div>
        </div>

        <div
          onTouchTap={this.props.closeHandler}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1.5rem 0',
            width: '100%',
            backgroundColor: this.props.factionColors.light,
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
  memberCount: PropTypes.string,
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