<script></script>

<main>
	<body>
		<div class="container">
			<h1 class="quiz">Quiz</h1>
			<p class="title">Start by giving your quiz a name!</p>
			<form>
				<div class="form-group">
					<!-- <label for="Title"></label> -->
					<input type="text" class="form-control" id="quizTitle" placeholder="Enter title" />
				</div>
				<div class="form-group">
					<!-- <label for="Title"></label> -->
					<input
						type="text"
						class="form-control"
						id="participants"
						placeholder="Number of participants"
					/>
				</div>
			</form>
			<div class="btn-group col-xs-3" role="group">
				<p><button type="button" class="btn btn-primary btn-block" id="go">Go</button></p>
				&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
				&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
				&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
				&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
				&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
				&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
				&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
				&nbsp; &nbsp; &nbsp; &nbsp;
				<p>
					<button type="button" class="btn btn-primary btn-block btn-space" id="cancel"
						>Cancel</button
					>
				</p>
			</div>
		</div>
	</body>
</main>

<style>
	body {
		background: #7801a8;
	}
	.quiz {
		color: white;
		font-size: 64px;
		font-family: JejuGothic;
		word-wrap: break-word;
		padding-top: 6rem;
	}
	.title {
		padding-top: 2rem;
		color: white;
		font-size: 30px;
		font-family: JejuGothic;
		word-wrap: break-word;
	}
	#quizTitle {
		border: None;
		padding: 0.75rem;
		background-color: #f0e9e9;
		margin-bottom: 2rem;
	}
	#participants {
		border: None;
		padding: 0.75rem;
		background-color: #f0e9e9;
		margin-bottom: 2rem;
	}
	#go {
		width: 6rem;
		padding: 0.75rem;
		border: None;
		background: #c49eff;
		border-radius: 12px;
	}
    .btn:active 
    {
        background-color: #C49EFF;
        color: #000000;
    }
	#cancel {
		width: 6rem;
		background: #c70000;
		border-radius: 12px;
		border: None;
		padding: 0.75rem;
	}
</style>
