# Frontend-Komponenten

## PageHeader
Provides the title of the tool, the current election name, the current user name (on the right) and a Leave-Button (on the left) which redirects to the Schul-Cloud Main-page.

## MainView
Provides a progress bar indicating the current phase and loads the content of the current phase from the corresponding page/component.

## Election Selection
<b> This is the startpage of our tool. </b>
It provides a list of all available elections for the current user including open, finished and self-made elections. By clicking on one the user jumps to this election and can continue the current phase.
Furthermore he can create a new election, by clicking the corresponding button at the bottom.

## ElectionCreation
Provides a form to create new elections.

### ElectionCreationGeneralOptions
First section of the election creation form.
It provides input fields to set election title, election office, election committee, election description and schoolname. The component validates its input.

### ElectionCreationElectionMode
Second section of the election creation form.
It provides input fields to set the number of votes per user and the election mode: whether the winner and the deputy should be of different gender and whether the Teacher wants to see live preview of the election results. The component validates its input.

### ElectionCreationElectionDate
Third section of the election creation form.
It provides input fields to set the start / end dates of the election phases or to decide to switch between phases manually by button clicks.

### StudentDropdown
Provides a dropdown menu to select the eligible voters from a list of students. Fetches students data from backend on its own.

## Info
Provides a short explanation of how our tool works to the students before the teacher starts the application phase.

## Application
Provides a card, students can write and submit their application consisting of a gender, infotext and motivation-text. If they visite the page later again, they will see their application only in read-only mode with two buttons allowing to modify or delete their application. They can't apply twice at the same time.
The teacher sees all currently applied candidates (in real-time).

It uses the input-Button component (type radio input) for choosing the gender and the animated submit-button component for submitting.

### textField
This component offers a textarea-autosize component (if the content should be editable) or a simple div element (if the content should be read-only) depending on whether the application may be edited or only read.

## Vote
Provides a list of all candidates, which can be elected. The student can cast as many votes as the teacher has specified when creating the election.
Once a ballot paper has been submitted, it can not be changed or viewed later.
Every voter can vote exactly once, because the backend stores who has already voted.

This component uses the animated submit-button component for submitting and the collapsibleList component to display the candidates.

### CollapsibleList
Offers a candidateCollapsible component for each candidate in the candidate-Array (Prop).

### CandidateCollapsible
Provides an inputButton component (type checkbox) and the candidate Infos like Name, Info and Motivation to the basicCollapsible component for the current candidate.

### BasiCollapsible
Displays the given Content (via Slots) in a way, that the header content is located in a clickable button. On click this button will be expanded and reveal the body content (e.g. the candidates Info and motivation).

## Result
Provides the election results to the students, consisting of the participation-chart component and the result-chart component.
In addition, all candidates will be listed again as in the voting phase.

### Participation-Chart
Displays the number of votes submitted, votes not yet submitted and abstentions by all eligible voters.
Uses Vue's chart.js

### Result-Chart
Displays the distribution of votes.
Uses Vue's chart.js.

## (Teacher) Dashboard
Provides the view for the creator of an election (jump to it by clicking on a self-made election on the election-selection page).
Here the Creator e.g. a teacher can switch between the phases (if selected manual switches in the election creation) and see the current status of each phase live. This can include a list of all applied candidates, their application texts and the participation and result charts.

Furthermore the component provides a protocol generator.

### Protocol Generator
By clicking the protocol button, a teacher can automatically generate a valid election-protocol with the given information of the election-creation (according to the Brandenburg school law)
It is provided in pdf-format.



