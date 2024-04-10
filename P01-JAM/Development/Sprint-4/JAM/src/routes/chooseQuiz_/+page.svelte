<script>
    //@ts-nocheck

    // This is a placeholder for your quizzes and selectedQuiz.
    // In a real app, this might come from a store or an API.
    import { quizzes_ } from "$lib/dummyQuiz3.js"
    import { onMount } from "svelte";
    import { QUIZ_DISPLAY_PAGINATION } from "$lib/config.js"
    import { writable } from 'svelte/store';

    const pageloading = writable(true);
    const paginationloading = writable(false);

    let quizzes = []
    let paginatedQuizzes = [];
    
    let selectedQuiz = 0
    let currentPage = 1;
    const quizzesPerPage = QUIZ_DISPLAY_PAGINATION;
  
    function selectQuiz(idx) {
      selectedQuiz = idx;
    }

    function downloadQuizAsJSON(idx) {
      const quizObject = quizzes[idx];

      // Convert the quiz object to a JSON string
      const jsonString = JSON.stringify(quizObject, null, 2); // Beautify the JSON output

      // Blob and URL.createObjectURL for download
      const blob = new Blob([jsonString], { type: "application/json;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      // Temporary link to trigger download
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${quizObject.title}.json`);
      document.body.appendChild(link);
      link.click();

      // Clean up the URL after download
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    function importAsJSON(event){
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target.result;
          const parsedQuiz = JSON.parse(content);
          console.log("Parsed: \n");
          console.log(parsedQuiz);

          //save to quizzes
          quizzes.push(parsedQuiz);
          //force svelte to update
          quizzes = [...quizzes];
        };
        reader.readAsText(file);
      }
    }

    function paginate() {
      const startIndex = (currentPage - 1) * quizzesPerPage;
      paginatedQuizzes = quizzes.slice(startIndex, startIndex + quizzesPerPage);
    }

    // Pagination for quizzes, add timeout to emulate API call
    async function fetchQuizzes(page) {
      paginationloading.set(true);
      // Simulate an asynchronous API call with a delay
      return new Promise(resolve => {
        setTimeout(() => {
          const startIndex = (page - 1) * quizzesPerPage;
          resolve(quizzes.slice(startIndex, startIndex + quizzesPerPage));
        }, 1000); // Delay of 1 second
      });
    }

    async function nextPage() {
      const maxPage = Math.ceil(quizzes.length / quizzesPerPage);
      if (currentPage < maxPage) {
          currentPage++;
          paginatedQuizzes = await fetchQuizzes(currentPage);
          paginationloading.set(false);
      }
    }

    async function previousPage() {
        if (currentPage > 1) {
            currentPage--;
            paginatedQuizzes = await fetchQuizzes(currentPage);
            paginationloading.set(false);
        }
    }



    let editingQuestionId = null;
    let editingImageUrlId = null;
    let editingChoiceId = null;

    function toggleEditQuestion(id) {
        editingQuestionId = editingQuestionId === id ? null : id;
    }

    function toggleEditImageUrl(id) {
        editingImageUrlId = editingImageUrlId === id ? null : id;
    }

    function toggleEditChoice(id) {
        editingChoiceId = editingChoiceId === id ? null : id;
    }

    function updateChoice(question, index) {
        question.choices[index] = question.choices[index].trim();
        console.log(quizzes)
        editingChoiceId = null;
    }

    function setCorrectAnswer(question, choice) {
        question.answer = choice;
        console.log(quizzes)
        editingChoiceId = null;
    }

    function saveQuestion(question, property, value) {
        question[property] = value;
        editingQuestionId = null;
        editingImageUrlId = null;
    }
  
    // Placeholder functions for upload, download, and choose quiz.
    function uploadQuiz() { /* upload logic */ }
    function downloadQuiz(selectedQuiz) { 
      downloadQuizAsJSON(selectedQuiz);
    } 
    function chooseQuiz() { /* TODO LATER */ }


    onMount(() => {
        setTimeout(() => {
          pageloading.set(false); // Set loading to false after data is 'fetched'\
          quizzes = quizzes_;
          paginate(); // Assuming you have a paginate function ready
        }, 1000); // 1 second delay
    });
  </script>

    {#if $pageloading}
      <div class="fixed inset-0 bg-purple-500 flex justify-center items-center">
        <div class="loader"></div> <!-- Custom spinner -->
      </div>
    {:else}
      <div class="flex flex-col md:flex-row min-h-screen">

        <!-- Dropdown for quizzes on smaller screens -->
        {#if $paginationloading}
          <div class="md:hidden bg-purple-900 p-4 text-indigo-200 font-bold">
            <p>Loading...</p>
          </div>
        {:else}
          <div class="md:hidden bg-purple-900 p-4 text-indigo-200 font-bold">
            <select 
              class="w-full bg-purple-900 text-white p-3 rounded cursor-pointer"
              on:change={(e) => selectQuiz(e.target.value)}>
              {#each paginatedQuizzes as quiz, idx}
                <option value={idx}>{quiz.title}</option>
              {/each}
            </select>
          </div>
        {/if}
    
        <!--Pagination for smaller screens-->
        {#if quizzes.length>quizzesPerPage}
          <div class="md:hidden bg-purple-900 p-4 text-indigo-200 font-bold flex justify-between">
            <button class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out" on:click={previousPage}>
              Previous
            </button>
            <span class="text-white font-bold">{currentPage}</span>
            <span class="text-white font-bold">/</span>
            <span class="text-white font-bold">{Math.ceil(quizzes.length / quizzesPerPage)}</span>
            <button class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out" on:click={nextPage}>
              Next
            </button>
          </div>
        {/if}
          
        <!-- Quizzes list for larger screens -->
        <div class="hidden md:block md:w-1/4 bg-purple-900 p-4 text-indigo-200 font-bold overflow-auto">
          {#if $paginationloading}
            <p>Loading...</p>
          {:else}
            {#each paginatedQuizzes as quiz, idx}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <div 
                class="p-3 hover:bg-gray-700 cursor-pointer rounded transition duration-150 ease-in-out"
                on:click={() => selectQuiz( idx + (currentPage - 1) * quizzesPerPage)}>
                {quiz.title}
              </div>
            {/each}
          {/if}
          <!--Pagination for larger screens-->
          {#if quizzes.length > quizzesPerPage}
            <div class="flex justify-between mt-4">
              <button class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out" on:click={previousPage}>
                Prev
              </button>
              <span class="text-white font-bold">{currentPage}</span>
              <span class="text-white font-bold">/</span>
              <span class="text-white font-bold">{Math.ceil(quizzes.length / quizzesPerPage)}</span>
              <button class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out" on:click={nextPage}>
                Next
              </button>
            </div>
          {/if}
    
        </div>
    
        <!-- Quiz -->
        <div class="w-full md:w-3/4 flex flex-col bg-purple-500 shadow-lg min-h-screen">
            <!-- Quiz options bar-->
            <div class="p-4 flex justify-between items-center bg-purple-800 border-b">
                <button class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out" on:click={()=>{downloadQuiz(selectedQuiz)}}>
                    Download
                </button>
                <button class="hidden md:block bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out" on:click={uploadQuiz}>
                    Import JSON
                </button>
                <button class="hidden md:block bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out" on:click={uploadQuiz}>
                    Save to Cloud
                </button>
                <button class="md:hidden bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out" on:click={uploadQuiz}>
                  Import
                </button>
                <button class="md:hidden bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out" on:click={uploadQuiz}>
                    Save
                </button>
                <button class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out" on:click={()=>{chooseQuiz(selectedQuiz)}}>
                    Choose
                </button>
            </div>
            
            <!-- Quiz editor -->
            <div class="p-4 overflow-auto">
                {#each quizzes[selectedQuiz].quiz as question, index}
                <div class="p-4 my-2 bg-purple-100 rounded shadow-sm">
                    {#if editingQuestionId === index}
                        <input
                            class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            bind:value={question.question}
                            on:blur={() => saveQuestion(question, 'question', question.question)}
                        />
                    {:else}
                        <button class="w-full text-left" on:click={() => toggleEditQuestion(index)}>
                            <h3 class="text-lg font-medium text-gray-800">{question.question}</h3>
                        </button>
                    {/if}
    
                    {#if question.imageUrl}
                        {#if editingImageUrlId === index}
                            <input
                                class="mt-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                type="text"
                                bind:value={question.imageUrl}
                                on:blur={() => saveQuestion(question, 'imageUrl', question.imageUrl)}
                            />
                        {:else}
                            <button class="mt-2" on:click={() => toggleEditImageUrl(index)}>
                                <img src={question.imageUrl} alt="imge" class="h-40 w-full object-cover rounded-md shadow-md" />
                            </button>
                        {/if}
                    {:else}
                        {#if editingImageUrlId === index}
                            <input
                                class="mt-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                type="text"
                                placeholder="Enter image URL"
                                bind:value={question.imageUrl}
                                on:blur={() => saveQuestion(question, 'imageUrl', question.imageUrl)}
                            />
                        {:else}
                            <button class="mt-2 py-2 px-4 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded transition duration-150 ease-in-out" on:click={() => toggleEditImageUrl(index)}>
                                Add Image URL
                            </button>
                        {/if}
                    {/if}
    
                    <div class="mt-2">
                      {#if editingChoiceId === index}  
                        {#each question.choices as choice, c_index}
                            <div class="flex items-center mb-2">
                                <input
                                    type="text"
                                    class="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                    bind:value={question.choices[c_index]}
                                    on:blur={() => updateChoice(question, c_index)}
                                />
                                <button
                                    class="ml-2 text-sm px-3 py-1 rounded bg-purple-500 text-white hover:bg-purple-700"
                                    on:click={() => setCorrectAnswer(question, choice)}
                                >
                                    {question.answer === choice ? 'Correct' : 'Set as Correct'}
                                </button>
                            </div>
                        {/each}
                      {:else}
                        <ul class="list-disc list-inside space-x-4">
                          {#each question.choices as choice}
                              <button class="mt-2" on:click={()=>{toggleEditChoice(index)}}>
                                <ul class="{choice === question.answer ? 'text-green-600 font-semibold' : 'text-gray-800'}">{choice}</ul>
                              </button>
                          {/each}
                        </ul>
                      {/if}
                    </div>
    
                    <div class="text-right mt-2">
                        <span class="text-sm font-medium text-gray-600">Time Limit: {question.timeLimit} seconds</span>
                    </div>
                </div>
                {/each}
            </div>
        </div>
      </div>
    {/if}


  <style>
    /* Simple CSS spinner animation */
    .loader {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #600e74; /* You can change the color to match your brand */
      border-radius: 50%;
      width: 64px; /* You can adjust the size */
      height: 64px; /* You can adjust the size */
      animation: spin 2s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>