import ky from 'ky';

const api = ky.create({
  prefixUrl: 'https://api.spacexdata.com/v4',
  retry: {
    methods: ['get'],
  },
  hooks: {
    beforeError: [
      async error => {
        const { response } = error;

        if (response) {
          try {
            const data = (await response.json()) as { message?: string };

            error.name = 'RocketAPIError';
            error.message = data?.message || `${response.status} - ${response.statusText}`;
          } catch {
            error.message = `${response.status} - ${response.statusText}`;
          }
        }

        return error;
      },
    ],
  },
});

export default api;
