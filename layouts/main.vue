<template>
  <div class="main-layout">
    <header>
      <nav>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>
    </header>

    <main>
      <nuxt />
    </main>

    <footer>
      <p>&copy; 2023 Your Company. All rights reserved.</p>
    </footer>
  </div>
</template>

<style lang="sass" scoped>
  .main-layout
    max-width: 960px
    margin: 0 auto
    padding: 20px

  header
    background-color: #f5f5f5
    padding: 10px

  nav ul
    list-style-type: none
    padding: 0
    margin: 0

  nav ul li
    display: inline-block
    margin-right: 10px

  nav ul li a
    text-decoration: none
    color: #333

  footer
    background-color: #f5f5f5
    padding: 10px
    text-align: center
</style>
