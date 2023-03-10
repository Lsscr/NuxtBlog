<template>
    <div class="layout">
        <header>
            <NavBar />
        </header>
        <main>
            <slot />
        </main>
        <footer>
            底部
        </footer>
    </div>
</template>

<style scope>
.layout {
    display: flex;
    flex-flow: column nowrap;
    width: 100%;
    height: 100%;
}

.layout main,
header,
footer {
    display: flex;
    position: relative;
}

.layout header,
footer {
    height: 100%;
}

.layout main {
    flex: 1;
}
</style>