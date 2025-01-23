<style>
    .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
  }

  .spinner {
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid #ffffff;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .loading-text {
    margin-top: 12px;
    font-size: 1.2rem;
    color: white;
  }
</style>

<div>HIIIIIIIIIIIIIIIII</div>
<div class="loading-container">
    <div class="spinner"></div>
    <p class="loading-text">Loading...</p>
</div>