FROM ruby:2.6.5

# Additional packages : we are adding the netcat package so we can
# make pings to the database service
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -

# 必要なパッケージのインストール（基本的に必要になってくるものだと思うので削らないこと）
RUN apt-get update -qq && \
    apt-get install -y build-essential \ 
    libpq-dev \ 
    default-mysql-client
RUN apt-get install -y yarn
RUN apt-get install -y tzdata
RUN apt-get install -y nodejs

# 作業ディレクトリの作成、設定
RUN mkdir /task_management 
##作業ディレクトリ名をAPP_ROOTに割り当てて、以下$APP_ROOTで参照
ENV APP_ROOT /task_management
WORKDIR $APP_ROOT

# ホスト側（ローカル）のGemfileを追加する（ローカルのGemfileは【３】で作成）
ADD ./task_management/Gemfile $APP_ROOT/Gemfile
ADD ./task_management/Gemfile.lock $APP_ROOT/Gemfile.lock

# Gemfileのbundle install
RUN bundle install
ADD ./task_management/ $APP_ROOT
RUN bundle install
RUN yarn