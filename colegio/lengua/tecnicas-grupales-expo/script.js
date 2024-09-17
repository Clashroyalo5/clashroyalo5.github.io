document.getElementById('downloadBtn').addEventListener('click', function() {
    const link = document.createElement('a');
    link.href = 'https://clashroyalo5.github.io/colegio/lengua/tecnicas-grupales-expo/Técnicas%20Grupales.pptx'; // Asegúrate de que la ruta sea correcta
    link.download = 'diapositivas tecnicas grupales.pptx'; // Nombre del archivo que se descargará
    link.click();
  });
  
  document.getElementById('downloadDoxc').addEventListener('click', function() {
    const link = document.createElement('a');
    link.href = 'https://clashroyalo5.github.io/colegio/lengua/tecnicas-grupales-expo/folleto.docx'; // Asegúrate de que la ruta sea correcta
    link.download = 'Folleto tecnicas grupales - mesa redonda.docx'; // Nombre del archivo que se descargará
    link.click();
  });
  
  document.getElementById('discordBtn').addEventListener('click', function() {
    // Cambia el enlace por la URL de tu grupo de Discord.
    window.open('https://discord.gg/38VRwu9PnW', '_blank');
  });
  
  document.getElementById('whatsappBtn').addEventListener('click', function() {
    // Cambia la URL de "tu-pagina.com" a la de tu página web.
    const whatsappUrl = `https://api.whatsapp.com/send?text=Mira%20Esta%20Es%20La%20Página%20De%20La%20Tecnica%20Grupal:%20Mesa%20Redonda:%20https://clashroyalo5.github.io/colegio/lengua/tecnicas-grupales-expo/`;
    window.open(whatsappUrl, '_blank');
  });
  
  document.getElementById('creditsBtn').addEventListener('click', function() {
    document.getElementById('creditsModal').style.display = 'block';
  });
  
  document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('creditsModal').style.display = 'none';
  });
  
  window.onclick = function(event) {
    if (event.target == document.getElementById('creditsModal')) {
      document.getElementById('creditsModal').style.display = 'none';
    }
  };
  
