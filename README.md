# Task-Management
This is the source code to our task management web app.

## List architecture
List items are managed with one authoritative two-dimensional array, stored in a JSON-like manner.
- List items can be added, edited, and deleted
- They are rendered by JavaScript to appear as a vertical list of cards

## Switching between the Dashboard and Statistics menu
There exists a block in our HTML code:
```html
<!-- MAIN BODY -->
<div id="mainbody">
    <div class="mainFlex">
        <div class="tasks-container" id="tasksContainer">
            <!-- Cards will be generated here by JavaScript -->
        </div>
    </div>
</div>
```
This block contains the list of cards on the home menu. However, it is also reused by the statistics menu. Thus, any time the tasks are rendered, it first checks if the user is actually on the home page. If not, it will render the statistics page. The value which dictates whether or not the user is on the home page can be changed by clicking the statistics button and the home button.