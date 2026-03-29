# Lab 9 - Quiz and Hackathon

- [About the lab](#about-the-lab)
- [Quiz](#quiz)
- [Hackathon](#hackathon)
  - [Ideation](#ideation)
  - [Requirements elicitation](#requirements-elicitation)
  - [Planning](#planning)
  - [Implementation](#implementation)
    - [Proof of concept](#proof-of-concept)
    - [Prototype](#prototype)
    - [Minimal valuable product](#minimal-valuable-product)
  - [Delivery](#delivery)
    - [Submit a presentation on `Moodle`](#submit-a-presentation-on-moodle)
    - [Publish the product code on `GitHub`](#publish-the-product-code-on-github)

## About the lab

Lab opens with a [quiz](#quiz) and then kicks off the [hackathon](#hackathon).

You must complete both to get the full point for Lab 9.

During the lab:

<!-- no toc -->
- Write a [quiz](#quiz)
- Get your [idea](#ideation) and [plan](#planning) approved by the TA

By Thursday 23:59, complete:

<!-- no toc -->
- [Implementation](#implementation)
- [Delivery](#delivery)

## Quiz

Pen and paper quiz.

- Closed-book, no devices allowed.
- You get random 3 questions from the question bank (available on Moodle).
- Answer at least 2 out of 3 correctly.

## Hackathon

During the hackathon, each student:

- Works individually.
- Builds their own project.
- Goes from idea to a deployed product.

Tasks:

<!-- no toc -->
1. [Ideation](#ideation)
2. [Planning](#planning)
3. [Implementation](#implementation)
4. [Delivery](#delivery)

### Ideation

Define:

- End users of the product
- Which problem your product solves for the end users
- The product idea

The product idea must be:

- Easy to explain in one sentence
- Easy to implement using an agent
- Clearly solve the problem for end users
- Different from the project used in SET labs

The product must have at least these components:

- The nanobot agent
- Frontend
- Backend
- Database

Each component must:

- Interact with at least one other component
- Be necessary in solving the problem for end users

### Requirements elicitation

Write a list of prioritized functional requirements for your product.

For each requirement, specify unambiguous testable acceptance criteria.

### Planning

For each each product version, specify which requirements will be covered in it:

<!-- no toc -->
1. [Proof of concept](#proof-of-concept)
2. [Prototype](#prototype)
3. [Minimal valuable product](#minimal-valuable-product)

### Implementation

#### Proof of concept

Prove that your idea can work when implemented in software.

Tip: use `Build` in `Google AI Studio`.

#### Prototype

Implement enough to see how the product will look like and feel and where it can fail.

#### Minimal valuable product

Implement your product, fully covering the most important requirements.

Dockerize all services.

Deploy the product so that it's accessible by course instructors and students from the university network.

### Delivery

<!-- no toc -->
1. [Submit a presentation on `Moodle`](#submit-a-presentation-on-moodle)
2. [Publish the product code in the repository on `GitHub`](#publish-the-product-code-in-the-repository-on-github)
3. [Add `README.md` in the repository on `GitHub`](#add-readmemd-in-the-repository-on-github)

#### Submit a presentation on `Moodle`

Submit on Moodle a 5-minute presentation with at most ten slides:

- Title slide:
  - Product title
  - Your name
  - Your university email
  - Your group

- Agenda slide:
  - List of sections in the presentation

- Context slide(s):
  - Your end users
  - The problem of end users you are solving
  - Your solution

- Implementation slide(s):
  - How you built the product

- Demo slide(s):
  - Pre-recorded demo with live commentaries (no longer than 2 minutes)

- Final slide:
  - Link and QR code for each of these:
    - The GitHub repo with the product code
    - Product deployed on a VM

#### Publish the product code on `GitHub`

- Publish the product code in a repository on `GitHub`.

  The repository name must be `se-toolkit-<product-name>` (without `<` and `>`).

- Add the MIT license file to make your product truly free and open-source.

- Add `README.md` in the product repository.
  
  Recommended structure of the `README.md`:
  
  - Product name
  
  - One-line description
  
  - Demo:
    - A couple of relevant screenshots of the product

  - Product context:

    - End users
    - Problem that your product solves for end users
    - Your solution
  
  - Usage:

    - Explain how to use your product
  
  - Deployment:

    - Which OS the VM should run (you may assume `Ubuntu 24.04` like on your university VMs)
    - What should be installed on the VM
    - Step-by-step deployment instructions
