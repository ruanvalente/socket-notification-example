<template>
  <div>
    <p>
      View notification in
      <a href="http://localhost:5173" target="_blank">
        React app
      </a>
    </p>

    <p v-if="receivedNotification">Notication: {{ receivedNotification }}</p>
  </div>
</template>

<script setup>
import io from 'socket.io-client'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const socket = io('http://localhost:3000');
const receivedNotification = ref('')

socket.on('connect', () => {
  console.log('Conectado ao servidor WebSocket');
});

// Evento de notificação
socket.on('notification', (data) => {
  receivedNotification.value = JSON.parse(data.notification)
  console.log('Recebido evento de notificação:', data);
});

// Limpando a conexão ao destruir o componente
onBeforeUnmount(() => {
  socket.disconnect();
});

onMounted(() => {
  console.log('Componente está montado');
});
</script>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
