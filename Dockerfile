ARG BUILD_IMAGE=usgs/node:latest
ARG FROM_IMAGE=usgs/httpd-php:latest

FROM ${BUILD_IMAGE} as buildenv

# dependencies for build
USER root
RUN yum install -y php bzip2 && \
    npm install -g grunt-cli

COPY . /earthquake-latest-earthquakes
WORKDIR /earthquake-latest-earthquakes

# perform build
RUN /bin/bash --login -c "\
    npm install --no-save && \
    php src/lib/pre-install.php --non-interactive && \
    grunt builddist && \
    rm dist/conf/config.ini dist/conf/httpd.conf \
    "

ENV APP_DIR=/var/www/apps

# pre-configure template
RUN /bin/bash --login -c "\
    mkdir -p ${APP_DIR}/hazdev-template && \
    cp -r node_modules/hazdev-template/dist/* ${APP_DIR}/hazdev-template/. && \
    php ${APP_DIR}/hazdev-template/lib/pre-install.php --non-interactive \
    "

# pre-configure app
RUN /bin/bash --login -c "\
    mkdir -p ${APP_DIR}/earthquake-latest-earthquakes && \
    cp -r dist/* ${APP_DIR}/earthquake-latest-earthquakes/. && \
    php ${APP_DIR}/earthquake-latest-earthquakes/lib/pre-install.php --non-interactive \
    "

FROM ${FROM_IMAGE}

COPY --from=buildenv /var/www/apps/ /var/www/apps/

# configure
RUN /bin/bash --login -c "\
    cp /var/www/apps/earthquake-latest-earthquakes/htdocs/_config.inc.php /var/www/html/. && \
    ln -s /var/www/apps/hazdev-template/conf/httpd.conf /etc/httpd/conf.d/hazdev-template.conf && \
    ln -s /var/www/apps/earthquake-latest-earthquakes/htdocs/lib/ /var/www/html/lib && \
    ln -s /var/www/apps/earthquake-latest-earthquakes/conf/container_redirects.conf /etc/httpd/conf.d/container_redirects.conf && \
    ln -s /var/www/apps/earthquake-latest-earthquakes/conf/httpd.conf /etc/httpd/conf.d/earthquake-latest-earthquakes.conf \
    "

HEALTHCHECK \
    --interval=15s \
    --timeout=1s \
    --start-period=1m \
    --retries=1 \
    CMD \
        test $(curl -s -0 /dev/null -w '%{http_code}' http://localhost/) -eq 200

EXPOSE 80