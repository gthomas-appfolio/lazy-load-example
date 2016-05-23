import Ractive from 'ractive';
import xhttp from 'xhttp';
import _ from 'lodash';

export default Ractive.extend({ // jshint ignore:line
  template: require('./Home.html'),
  data() {
    return {
      loading: true,
      search_index: 0
    }
  },
  computed: {
    search_results() {
      let { data, search } = this.get();
      search = search.trim().toLowerCase();
      if (search.trim().length > 0) {
        return _.filter(data, user => user.first.startsWith(search) ||  user.last.startsWith(search)) || [];
      } else {
        return []
      }
    }
  },
  oninit() {
    let page_size = 500;

    this.observe({
      search: () => this.set({ search_index: 0 }) // Reset index on new search
    });

    // Request first page of data, up to page_size results:
    xhttp({ method: 'get', url: `/api/data?size=${page_size}`})
      .then(data => {
        // Get total results from first request:
        let total_results = data.total;

        // Display first results and total:
        this.set({
          data: data.results,
          total: total_results
        });

        // If results length < page size, we are done; otherwise queue up requests:
        if (total_results > page_size) {

          // Build array of page start indexes:
          let page_indexes = _.range(page_size, total_results, page_size);

          // Create array of promises for requesting each page, then appending results:
          let page_requests =
              page_indexes.map(start_index => () => {
                return xhttp({ method: 'get', url: `/api/data?size=${page_size}&start=${start_index}`})
                          .then(data => this.push('data', ...data.results)); // Appends data
              });

          // Sets loading indicator to false when all requests are complete:
          page_requests.push(() => this.set({ loading: false }));

          // This calls the promises above in sequence:
          page_requests.reduce((promise, next_request) => promise.then(next_request), Promise.resolve());

          // Parallel
//          let page_requests =
//              page_indexes.map(start_index => new Promise(() => {xhttp({ method: 'get', url: `/api/data?size=${page_size}&start=${start_index}`})
//                          .then(data => this.push('data', ...data.results))); // Appends data
//          // Start all requests, set loading indicator to false when all are complete:
//          Promise.all(page_requests)
//            .then(data => this.set({ loading: false }))
//            .catch(err => console.error);
        }
      })
      .catch(err => console.error);
  }
});
