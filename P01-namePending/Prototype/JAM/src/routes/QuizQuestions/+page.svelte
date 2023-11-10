<script>
	let quiz1 = [
		{
			question: '',
			answer: '',
			choices: ['', '', '', '']
		}
	];

	function addQuestion() {
		quiz1.push({
			question: '',
			answer: '',
			choices: ['', '', '', '']
		});
	}

	/**
	 * @param {number} questionIndex
	 * @param {string} choiceText
	 */
	function updateAnswer(questionIndex, choiceText) {
		quiz1[questionIndex].answer = choiceText;
	}

	/**
	 * @param {number} questionIndex
	 * @param {Event & { currentTarget: EventTarget & HTMLInputElement; }} event
	 */
	function updateQuestionText(questionIndex, event) {
		const target = event.currentTarget;
		quiz1[questionIndex].question = target.value;
	}
	/**
	 * @param {number} questionIndex
	 * @param {number} optionIndex
	 * @param {Event & { currentTarget: EventTarget & HTMLInputElement; }} event
	 */
	function updateOptionText(questionIndex, optionIndex, event) {
		const target = event.currentTarget;
		quiz1[questionIndex].choices[optionIndex] = target.value;
	}

	// function increaseTime() {
	//     timeLimit += 1; // increase time by 1 second
	// }
</script>

<main>
	<body>
		<!-- <div class="container">
            <div class="row align-items-center">
                <div class="col">
                    <p id="question1">Question 1</p>
                </div>
                <div class="col-auto">
                    <button on:click={increaseTime} class="btn btn-primary btn-block btn-space ml-auto">
                        Set time limit: {timeLimit} seconds
                    </button>
                </div>
            </div>
        </div> -->
		<div class="container">
			{#each quiz1 as question, qIndex}
				<div class="question-container">
					<div class="quizz">
						<label for={`question-${qIndex}`}>Question {qIndex + 1}</label>
						<input
							type="text"
							id={`question-${qIndex}`}
							class="form-control"
							placeholder="Type your question here"
							on:input={(event) => updateQuestionText(qIndex, event)}
						/>
					</div>
					{#each question.choices as choice, oIndex}
						<div class="option-group">
							<input
								type="text"
								class="form-control options"
								placeholder="Enter option"
								on:input={(event) => updateOptionText(qIndex, oIndex, event)}
							/>
							<input
								type="radio"
								class="form-check-input"
								checked={choice === question.answer}
								on:change={() => updateAnswer(qIndex, choice)}
								name={`option-${qIndex}`}
							/>
						</div>
					{/each}
				</div>
			{/each}
			<div class="container-md">
				<div class="btn-group">
					<div class="col-auto" id="addQuestion">
						<button on:click={addQuestion} class="btn btn-tertiary">Add question</button>
						<!-- <button class="btn btn-tertiary btn-block btn-space ml-auto"> Add question </button>  -->
					</div>
					<div class="col-auto" id="saveBtn">
						<button class="btn btn-secondary btn-block btn-space ml-auto"> Save </button>
					</div>
					<div class="col-auto" id="cancelBtn">
						<button class="btn btn-primary btn-block btn-space ml-auto"> Cancel </button>
					</div>
				</div>
			</div>
		</div>
	</body>
</main>

<style>
	.quizz {
		margin-top: 2rem;
		color: white;
		font-size: 36px;
		font-family: JejuGothic;
		font-weight: 400;
		word-wrap: break-word;
		margin-bottom: 2rem;
	}
	.container {
		display: flex;
		flex-direction: column;
		gap: 20px;
		padding: 1rem;
		margin-top: 2rem;
	}

	.question-container {
		background: #7801a8;
		padding: 20px;
		border-radius: 10px;
	}

	.option-group {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-top: 10px;
	}

	body {
		background: #7801a8;
	}
	.form-control {
		color: black;
		font-size: 20px;
		font-family: JejuGothic;
		font-weight: 400;
		word-wrap: break-word;
		width: 80rem;
		margin-top: rem;
	}
	/* .btn {
		border-radius: 12px;
		background-color: #f0e9e9;
		color: #000000;
		border: None;
		margin-top: -0.5rem;
		position: absolute;
		right: 2rem;
	}
	.btn:active {
		background-color: #c49eff;
		color: #000000;
	} */

	.option-group {
		display: flex;
		gap: 2rem;
		margin-top: 2rem;
		margin-bottom: 2rem;
	}
	.options {
		border: None;
		width: 20rem;
		color: black;
	}
	#cancelBtn {
		border-radius: 15px;
		color: white;
		font-size: 48px;
		font-family: JejuGothic;
		font-weight: 400;
		margin-left: 8rem;
		margin-top: -1.9rem;
	}
	.btn-primary {
		background: #c70000;
		border: None;
	}
	.btn-secondary {
		background: #00a59b;
		border: None;
	}
	.btn-tertiary {
		background: #c49eff;
		border: None;
	}
	#saveBtn {
		border-radius: 15px;
		color: white;
		font-size: 48px;
		font-family: JejuGothic;
		font-weight: 400;
		word-wrap: break-word;
		margin-top: -1.99rem;
		/* margin-right: -50rem; */
		margin-left: 52rem;
	}
	#addQuestion {
		border-radius: 15px;
		color: white;
		font-size: 48px;
		font-family: JejuGothic;
		font-weight: 400;
		margin-left: 0rem;
		margin-top: -1.99rem;
		margin-right: 6rem;
	}
	.btn-primary:active {
		background-color: #760000;
		color: #f0e9e9;
	}
	.btn-secondary:active {
		background-color: #05726b;
		color: #f0e9e9;
	}
	.btn-tertiary:active {
		background-color: #4f036d;
		color: #f0e9e9;
	}
</style>
