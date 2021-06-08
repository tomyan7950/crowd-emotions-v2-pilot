import React, { Component } from 'react'
import { Slider } from "@blueprintjs/core";

export default class Rating extends Component {

    handleChange = value => {
        const { player, round } = this.props
        const ratings = player.get("ratings")
        ratings[round.get("roundIndex")] = value
        player.set("ratings", ratings)
        player.stage.set("rating", value)
    }

    render() {
        const { player, round, stage } = this.props

        // Get rating
        const rating = player.get("ratings")[round.get("roundIndex")] === "NA" ? 1 : player.get("ratings")[round.get("roundIndex")]

        // Get the path
        const stimConfig = round.get("stimConfig")
        const path = `stimuli/${stimConfig.person}${-1 + rating + stimConfig.range[0]}.jpg`

        return (
            <div>
                <p>Please indicate the average level of {stimConfig.emotionAdj} in this group of faces. To give your response, drag the slider left (less {stimConfig.emotion}) and right (more {stimConfig.emotion}), and you will change the {stimConfig.emotionAdj} level of this person’s face.</p>
                <p>Once you are satisfied with your response, please click next.</p>
                <br />
                <div className="title">
                    <img src={path} alt="image of morphed face" />
                </div>
                <br />
                <Slider
                    min={1}
                    max={50}
                    stepSize={1}
                    labelValues={[1, 25, 50]}
                    value={rating}
                    onChange={this.handleChange}
                    showTrackFill={false}
                />
                <br />
                {
                    stage.get("isFinalRating") &&
                    <BinaryChoice stimConfig={stimConfig} {...this.props} />
                }
                {
                    player.stage.submitted
                        ? <div className="title waiting-msg">Your rating has been submitted. Waiting for other players to submit...</div>
                        : <div className="flex-c">
                            <button
                                className="main-btn"
                                disabled={player.get("ratings")[round.get("roundIndex")] === "NA" || (stage.get("isFinalRating") && player.get("binaryChoice")[round.get("roundIndex")] === "NA")}
                                onClick={() => player.stage.submit()}
                            >
                                Next
                        </button>
                        </div>
                }
            </div>

        )
    }
}

class BinaryChoice extends Component {
    handleChangeBinary = e => {
        const { player, round } = this.props

        // Get binaryChoice
        const binaryChoice = player.get("binaryChoice")
        // update value
        binaryChoice[round.get("roundIndex")] = e.currentTarget.value
        // set binary choice
        player.set("binaryChoice", binaryChoice)

    }

    render() {
        const { stimConfig } = this.props


        return (
            <>
                <div className="binary-choice-holder">
                    <p>If you had to choose one of the two emotions, which would would choose?</p>
                    <p>
                        <label className="my-radio">
                            <input type="radio" name="binary-emotion" value="neutral" onChange={this.handleChangeBinary} /> neutral
                    </label>
                    </p>
                    <p>
                        <label className="my-radio">
                            <input type="radio" name="binary-emotion" value={stimConfig.emotion} onChange={this.handleChangeBinary} /> {stimConfig.emotion}
                        </label>
                    </p>
                </div>
                <br />
            </>
        )
    }
}
