<template>
    <div>
        <p>Angka: {{ count }}</p>
        <p>Status: {{ isEven }}</p>
        <button type="button" @click="increment">+</button>
        <button type="button" @click="decrement">-</button>

        <hr />

        <p v-if="loading">Loading...</p>
        <p v-else-if="error">
            Error: {{ error }}
            <br/>
            <button type="button" @click="fetchTodo">Retry</button>
        </p>
        <p v-else>Todo Title: {{ todoTitle }}</p>

    </div>
</template>

<script setup lang="ts">
    import { computed, onMounted, ref } from 'vue';

    const count = ref(0);

    const increment = () => {
        count.value++;
    };

    const decrement = () => {
        count.value--;
    };

    const isEven = computed (() => {
        return count.value % 2 === 0 ? 'Genap' : 'Ganjil';
    });

    // state untuk fetch
    const todoTitle = ref('');
    const loading = ref(true);
    const error = ref<string | null>(null);

    const fetchTodo = async () => {
        try {
            loading.value = true;
            error.value = null;

            const response = await fetch('https://jsonplaceholder.typicode.com/todos-invalid/1');

            if (!response.ok) {
                throw new Error(`Gagal fetch data: ${response.status}`);
            }

            const data = await response.json();

            todoTitle.value = data.title;

        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Terjadi Kesalahan'
        } finally {
            loading.value = false;

        }

    }



    onMounted(() => {
        fetchTodo();
    });
</script>